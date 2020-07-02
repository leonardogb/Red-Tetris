import React, { useState, useEffect } from 'react';
import "./Footer.css";
import { Link, Router } from 'react-router-dom';
import { useHover } from '../Hooks/useHover';
import PdfFile from '../../assets/red_tetris.fr.pdf'

const Footer = () => {
  const [hoverRef, isHovered] = useHover();
  const [state, setstate] = useState(false);

  return (

    <div className="full-footer" >

      <div className="sub-footer" onClick={() => setstate(!state)}>
        {!state ?
        <div className="arrow-up">
        </div>
        :
        <div className="arrow-down">
        </div>
      }
      </div>
      {state ?
        <div className="main-footer">
          <div className="container">
            <div className="row">
              <div className="social">
                <h4>LGARCIA-</h4>
                <div className="row">
                  <a href="https://github.com/leonardogb" target="_blank" className="fa fa-github" title="Github lgarcia-"></a>
                  <a href="https://www.linkedin.com/in/leonardogb/" target="_blank" className="fa fa-linkedin" title="Linkedin lgarcia-"></a>
                </div>
              </div>
              <div className="social">
                <h4>DEWALTER</h4>
                <div className="row">

                  <div>
                    <a href="https://github.com/nis267" target="_blank" className="fa fa-github" title="Github dewalter"></a>
                  </div>
                  <div>
                    <a href="https://www.linkedin.com/in/denis-walter/" target="_blank" className="fa fa-linkedin" title="Linkedin dewalter"></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <p>
                &copy;{new Date().getFullYear()} <a href={PdfFile} className="subject" target="_blank" title="red tetris subject">Red Tetris</a>
              </p>
            </div>
          </div>
        </div>
        : null}

    </div>
  )
}

export default Footer;
