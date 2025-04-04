/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import {Row, Col} from 'react-bootstrap';
import './landing.css'
// import {scriptures as scriptArray} from '../../assets/Statements'
import scriptArray from './scriptArray.json'
import Welcome from '../../components/Welcome/'
import Footer from '../../components/Footer'
import { Link } from 'react-router';
import thoughtOfDay from '../../assets/images/thoughtOfDay.png'
import Card from 'react-bootstrap/Card';
import img100 from '../../assets/images/testimonyImg2.png';

function Landing({user}) {
    const [scripture, setScripture] = useState(0);
    useEffect(() => {
        console.log("scripts", scriptArray)
        //use timeinterval to change scripture every 5 seconds
        setInterval(() => {
            setScripture(Math.floor(Math.random() * scriptArray.length))
        }, 5000)
    }, [])
    return (
        <div className="landing">
            <main >
            <div>{user&&<h3>Welcome {user.firstName}</h3>}</div>
                <section className='landing-section'>
                    <div className='news-thoughts-div'>
                        <section className='landing-news border'>
                            <Link to='/news'>
                                <h2>News Story Headlines</h2>
                            </Link>
                        </section>
                        <section className='landing-thoughts border'>
                            {/* <h2>Thoughts for the Week</h2> */}
                            {/* <img className='w-100' src={thoughtOfDay} alt='placeholder' /> */}
                        </section>
                    </div>

                    <section className='script'>
                        <h1 className=''>{scriptArray[scripture]}</h1>
                    </section>
                    <section className='one-less-link'>
                      <Link to='/one-less'>
                        <Card  className="ol-card text-center border border-primary p-0 m-4">
                          <Card.Body className="bg-primary text-white">
                            <Card.Title><h3>One Less Lessons</h3></Card.Title>
                            <Card.Text as='div' className='bg-light text-dark border border-primary rounded p-2'>
                              <h4>Explore our lessons and insights.</h4>
                              <ul style={{ listStylePosition: 'inside', marginLeft: '0',fontFamily: 'cursive', fontSize: '1.2rem',fontWeight: 'bolder'}}>
                                <li>Lesson 1: Becoming Christians</li>
                                <li>Lesson 2: Living As Chrisitians</li>
                                <li>Lesson 3: Sharing with Christians</li>
                              </ul>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Link>
                    </section>
                </section>
                <Welcome />
                <section className='border d-flex justify-content-center align-items-center p-5'>
                    <Card className="testimony-card text-center border border-primary p-0 w-75">
                      <Card.Title><h3>My Testimony</h3></Card.Title>
                      <Card.Body
                        className="bg-primary text-white"
                        style={{ height: '70vh' }}  // adjust height as needed
                      >
                        <Row className="h-100">
                          <Col md={4} className="d-flex align-items-center justify-content-center">
                            <Card.Img
                              src={img100}
                              alt="testimony image"
                              style={{ height: '100%', objectFit: 'contain' }}
                            />
                          </Col>
                          <Col md={8} className="d-flex align-items-center">
                            <Card.Text
                              className="bg-light text-dark border border-primary rounded p-4 w-100 text-start"
                              style={{ height: '100%', overflowY: 'auto' }}
                            >
                              Just like the story in Luke 12:16-21, I was the "rich fool" described in the parable who wanted to expand his storage space rather than share his blessings with others including God. Then to add insult to injury, I, after the Lord told me not to, I counted my successes and took credit rather than crediting the Lord for using me to do his will. Man, is it possible to offend our loving, gracious God more than that all the while believing that I was in good standing with the Father. Praise the Lord for his mercy in that I did not get what I deserved.<span><ul className='p-2'>
                                <li>That was then, Now I am being called, justified and glorified (Romans 8:30)</li>
                                <li>That was then, Now I am the righteousness of God (2 Corinthians 5:21)</li>
                                <li>That was then, Now I no longer conform to the world and culture, my mind is transformed (Romans 12:2)</li>
                                </ul></span>

                            </Card.Text>
                          </Col>
                        </Row>
                      </Card.Body>
                        <Card.Footer className="bg-primary text-white">
                            <Link to='/my-testimony'>
                            <button className='btn btn-light w-50'>Read The Full Testimony</button>
                            </Link>
                        </Card.Footer>
                    </Card>
                </section>
            </main>
            <Footer />

        </div>

    )
}

export default Landing
