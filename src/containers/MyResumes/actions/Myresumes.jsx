import request from 'superagent';
import { executePrivateGql } from '../../../GqlClients';
import {
  resumesQuery,
  profileIndustriesQuery,
} from './gql/queries';
import {
  uploadResumeMutation,
  deleteResumesMutation,
} from './gql/mutations';

export const setProfileIndustries = profile => ({
  type: 'SET_INDUSTRIES',
  profile,
});

export const loadResumes = () => ({
  type: 'LOAD_RESUMES',
});

export const setResumes = resumes => ({
  type: 'SET_RESUMES',
  resumes,
});

export const uploadError = errors => ({
  type: 'UPLOAD_ERROR',
  errors,
});

export const deleteError = errors => ({
  type: 'DELETE_ERROR',
  errors,
});

export const uploadingResume = () => ({
  type: 'UPLOADING_RESUME',
});

export function clearUploadError() {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_UPLOAD_ERROR' });
  };
}

export function fetchMyIndustries() {
  return (dispatch) => {
    executePrivateGql({
      query: profileIndustriesQuery,
    }).then((res) => {
      dispatch(setProfileIndustries(res.data.profile));
    });
  };
}

export function fetchMyResumes() {
  return (dispatch) => {
    dispatch(loadResumes());
    executePrivateGql({
      query: resumesQuery,
    }).then((res) => {
      dispatch(setResumes(res.data.resumes));
    });
  };
}

export function uploadResume(name, description, pool, poolIsInstitution, industries,
  file, thumbnail) {
  return (dispatch) => {
    if (!file) {
      dispatch(uploadError('{"Missing resume": "You must upload a resume."}'));
      return;
    }
    if (!poolIsInstitution && pool === '') {
      dispatch(uploadError('{"e": "You must enter the private group ID."}'));
      return;
    }
    let institutionPool;
    let privatePool;
    if (poolIsInstitution) {
      institutionPool = pool;
      privatePool = '';
    } else {
      institutionPool = '';
      privatePool = pool;
    }

    dispatch(uploadingResume());

    executePrivateGql({
      mutation: uploadResumeMutation,
      variables: {
        name,
        description,
        industries,
        institutionPool,
        privatePool,
      },
    }).then((res) => {
      const resumeData = res.data.uploadResume;

      if (resumeData.errors) {
        dispatch(uploadError(resumeData.errors));
        return;
      }

      const uploadInfo = JSON.parse(resumeData.uploadInfo);
      const thumbnailUploadInfo = JSON.parse(resumeData.thumbnailUploadInfo);

      uploadInfo.fields.file = file;

      request
        .post(uploadInfo.url)
        .field(uploadInfo.fields)
        .end((err) => {
          if (err) {
            dispatch(uploadError(err));
            return;
          }

          thumbnail.toBlob((thumbnailBlob) => {
            const thumbnailFile = new File([thumbnailBlob], `${resumeData.resume.id}_thumbnail.jpg`);
            thumbnailUploadInfo.fields.file = thumbnailFile;

            request
              .post(thumbnailUploadInfo.url)
              .field(thumbnailUploadInfo.fields)
              .end(() => {
                window.location.href = `/resumes/${resumeData.resume.id}`;
              });
          }, 'image/jpeg', 0.2);
        });
    });
  };
}

export function deleteResumes(ids) {
  return (dispatch) => {
    executePrivateGql({
      mutation: deleteResumesMutation,
      variables: {
        ids,
      },
    }).then((res) => {
      const result = res.data.deleteResumes;
      if (result.errors) {
        dispatch(deleteError(result.errors));
      }
    });
  };
}
