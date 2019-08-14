import styled from 'styled-components';

const Wrapper = styled.footer`
  z-index: 10;
  font-family: Rubik !important;
  width: 100%;
  height: 35px;
  background-color: #efefef !important;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  border-top: 1px #ccc solid;

  .copyRight {
    padding-right: 1em;
  }
  a {
    padding-right: 1em;
    padding-left: 1em;
    color: #292929;
    transition: .5s ease;
  }
  a:hover {
    color: #d21280;
    text-decoration: none;
  }
}

`;

export default Wrapper;
