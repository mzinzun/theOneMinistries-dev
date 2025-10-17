/* eslint-disable react/prop-types */

import { useEffect, useState, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import axios from 'axios';
import './one-way.css';
import './content/content.css'
import Menu from '../../components/Menu'


const OneWay = ({ user, setUser, setScrips }) => {
  // const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const [lesson, setLesson] = useState('Introduction');
  const [studyDate, setStudyDate] = useState('');
  const [studyDay, setStudyDay] = useState(0);
  const buttonsRef = useRef([]);
  const lessonRef = useRef(null);
  // get data from the server
  const getData = async () => {
    const response = await axios.get('http://localhost:4040/get_scriptures');
    const data = response.data
    setScrips(data);
  }
  const days = async (date) => {
    // convert date to day of the year
    const startDate = new Date(date).getTime();
    const today = new Date().getTime();
    const day = Math.floor(((((today - startDate) / 1000) / 60) / 60) / 24);
    const formattedDate = new Date(user.studyStartDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    setStudyDate(formattedDate);
    setStudyDay(day);
  }
  // useEffect(() => {
  //   console.log('OneLess component mounted');
  //   getData();
  // }, []);
  useEffect(() => {
    getData();
    if (user && user.studyStartDate) {
      days(user.studyStartDate);
    }
  }, [user]);
  useEffect(() => {
    const refLesson = lessonRef.current;
    if (refLesson) {
      refLesson.scrollTo({ top: 0, behavior: 'smooth' });
      // Alternatively, use: contentRef.current.scrollTop = 0;
    }
  }, [lesson]);

  // get the number of days since the user started studying

  function handleClick(e) {
    // Set the lesson state to the clicked button's text content
    setLesson(e.target.textContent);
    // Remove 'active-btn' class from all buttons
    buttonsRef.current.forEach(button => button.classList.remove('active-btn'));
    // Add 'active-btn' class to the clicked button
    e.target.classList.add('active-btn');
  };

  return (
    <>
    <header>
      <Menu user={user} setUser={setUser} />
    </header>
      <main className='one-less'>
        <aside className='one-less-aside'>
          <h3>One Way Lessons</h3>
          <ul>
            <li>
              <Link to="introduction"><button ref={el => buttonsRef.current[0] = el} onClick={handleClick} id='introduction' >Introduction</button></Link>
            </li>
            <h4>Becoming Christians</h4>
            <li>
              <Link to="meet-god"><button ref={el => buttonsRef.current[1] = el} onClick={handleClick} id='meetGod' className='active-btn intro-title'>Meet God</button></Link>
            </li>
            <li>
              <Link to="salvation"><button ref={el => buttonsRef.current[2] = el} onClick={handleClick} id='salvation'>Salvation</button></Link></li>
            <li>
              <Link to="living"><button ref={el => buttonsRef.current[3] = el} onClick={handleClick} id='living'>Living</button></Link>
            </li>
            <h4>Living as Christians</h4>
            <li><Link to="morals">
              <button ref={el => buttonsRef.current[4] = el} onClick={handleClick} >Morals</button></Link>
            </li>
            <li>
              <Link to="confess-sins">
              <button ref={el => buttonsRef.current[5] = el} onClick={handleClick}>Confess My Sins</button>
              </Link>
            </li>
            <li>
              <Link to="eternal-security">
              <button ref={el => buttonsRef.current[6] = el} onClick={handleClick}>Eternally Secure</button>
              </Link>
            </li>
            <li>
              <Link to="oneliners">
              <button ref={el => buttonsRef.current[7] = el} onClick={handleClick}>One Liners for meditation (words of Wisdom)</button>
              </Link>
            </li>
            <li>
              <Link to="walk-word">
              <button ref={el => buttonsRef.current[8] = el} onClick={handleClick}>A Walk</button>
              </Link>
            </li>
            <h4>Sharing With Christians</h4>
            <li>
              <Link to="encourage">
              <button ref={el => buttonsRef.current[9] = el} onClick={handleClick}>Encourage Me</button></Link>
            </li>
            <li>
              <Link to="events">
              <button ref={el => buttonsRef.current[10] = el} onClick={handleClick}>One Way Event</button>
              </Link>
            </li>
            <li>
              <Link to="prayers">
                <button ref={el => buttonsRef.current[11] = el} onClick={handleClick}>Prayer Requests</button>
              </Link>
            </li>
            <li>
              <Link to="questions">
                <button ref={el => buttonsRef.current[12] = el} onClick={handleClick}>Questions and Answers: Ask The Bible</button>
              </Link>
            </li>
            <h4>Support Us!</h4>
          </ul>
        </aside>
        <section className='one-less-section' ref={lessonRef}>
          <div className='one-less-header'>
            {lesson === 'A Walk' &&
              <div className='a-walk-header'>
                {/* <p>Lesson: {lesson}</p> */}
                {user.studyStartDate && <p>Study date: {studyDate} (day: {studyDay})</p>}
              </div>
              }
          </div>
          {/* <div className='one-less-content' >
            {getComponent()}
          </div> */}
          <Outlet />
        </section>
      </main>
    </>
  )
}

export default OneWay;
