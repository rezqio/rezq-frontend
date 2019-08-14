import React from 'react';
import Divider from '@material-ui/core/Divider';

import TeamPhoto from '../../assets/about/team-photo.jpg';

import '../footerlinks.css';

const About = () => (
  <div className="section-container">
    <div className="section-body">
      <div className="section-content">
        <h1>What is RezQ?</h1>
        <Divider style={{ marginBottom: '20px' }} />

        <p className="about-text" style={{ fontWeight: 'bold' }}>
          RezQ is a free online peer-to-peer resume critiquing platform.
        </p>
        <p className="about-text">
          The goal of RezQ is to provide a platform to connect prospective job seekers with more
          experienced individuals who can provide insightful and industry-specific resume feedback.
        </p>
        <p className="about-text">
          Through the use of the Resume Pool feature, users are able to upload a resume publicly for
          anyone else on the site to critique. This way, ideas can be shared and feedback given
          freely.
        </p>
        <p className="about-text">
          Alternatively, users can upload their resume and generate a sharable critique link (which
          only the uploader will have access to by default), which they can then forward to their
          friends to review personally and privately.
        </p>

        <h1>The Team</h1>
        <Divider style={{ marginBottom: '20px' }} />

        <p className="about-text">
          RezQ was created by a team of 6 senior engineering students (Class of 2019) at the
          University of Waterloo. Through the
          {' '}
          {"university's"}
          {' '}
co-op program, the team came to recognize
          the difficulties of obtaining good resume feedback from others.
        </p>
        <p className="about-text">
          In lieu of a proper resume critiquing platform, the team aimed to design a free
          peer-to-peer platform that could help connect new co-op students with others who have
          significant resume writing experience specifically in their field of study.
        </p>

        <div className="about-team-photo-container">
          <img className="about-team-photo" src={TeamPhoto} alt="Team RezQ" />
          <p className="about-photo-caption">
            From left:
            {' '}
            <a
              href="https://linkedin.com/in/ianyuan"
              target="_blank"
              rel="noopener noreferrer"
            >
                Ian
            </a>
,
            {' '}
            <a
              href="https://www.linkedin.com/in/fanny-deng-20b42ba5"
              target="_blank"
              rel="noopener noreferrer"
            >
                Fanny
            </a>
,
            {' '}
            <a
              href="https://dongyuzheng.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
                Gary
            </a>
,
            {' '}
            <a
              href="http://andrewgapic.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
                Andrew
            </a>
,
            {' '}
            <a
              href="https://www.instagram.com/evancaocao/"
              target="_blank"
              rel="noopener noreferrer"
            >
                Evan
            </a>
,
            {' '}
            <a
              href="https://twitter.com/jubnaut"
              target="_blank"
              rel="noopener noreferrer"
            >
                Judy
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default About;
