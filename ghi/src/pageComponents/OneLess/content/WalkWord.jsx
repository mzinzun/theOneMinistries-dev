/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import axios from 'axios';
import WordStudy from './WordStudy';
const WalkWord = ({user, studyDay}) => {
  // variable to hold the study items
  const [studies, setStudies] = useState([]);

  // vairiable for study journal entries
  const [newEntry, setNewEntry] = useState([]);
  const [journalEntry, setJournalEntry] = useState([]);



  //  configuration for Dropdown options
  const [studyTitle, setStudyTitle] = useState('Choose an option');
  const [currentStudy, setCurrentStudy] = useState(null);

  const handleSelect = async (eventKey, e, parentId) => {
    // handleSelect will assign catagory and title(eventKey) to be passed to WordStudy component
    e.preventDefault();
    console.log(`parentId: catagory`, parentId);
    console.log(`eventKey: title`, eventKey);
    const myStudy = await studies.filter(item => item.title === eventKey);
    // set study selected to display on page
    setStudyTitle(eventKey);
    await setCurrentStudy(myStudy[0]);
    console.log(`study data`, currentStudy);
  }

  //  end configuration for Dropdown options

  const getData = async () => {
    // Get study items from database and puts them on the page: Note: this may be removed later if too large//
    console.log(" getdata accessed");
    const resp = await axios.get('http://localhost:4040/get_studies');
    // const data = resp.data;
    await setStudies(resp.data);
    console.log(`Studies data to have access to:`, studies);

  }
  useEffect(() => {
    console.log("WalkWord component mounted")
    // Get study items from database //
    getData()
  }, [])

  const submit = event => {

    // Adds user entries into their journal //

    event.preventDefault();
    let entryArrCopy = deepcopy(newEntry);
    entryArrCopy.unshift({
      entry: event.target.elements[0].value,
      date: new Date().toLocaleString()
    });

    // setNewEntry(entryArrCopy)
  }
  const journalEntries = newEntry.map((item, idx) => <p key={idx}>{item.entry} {item.date}</p>)

  return (
    <div> {/* Parent Div */}
      <div>
        <h2><b>A Walk in the Word</b></h2>
        <h3>Daily Devotionals and Bible Study</h3>
      </div>

      <div className='study-menu'>
        <p>Study By: {studyTitle} selected</p>
        <div className='row'>
          <Dropdown onSelect={(eventKey, e)=>handleSelect(eventKey,e,'Study Group')} id={'study-group'} className='col-2'>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              Study Group
            </Dropdown.Toggle>
            <Dropdown.Menu className='scrollable-menu'>
              <Dropdown.Item eventKey="Small Bite">Small Bite (one verse)</Dropdown.Item>
              <Dropdown.Item eventKey="Big Bite">One Passage of Cohesive Scripture</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown onSelect={handleSelect} id={'bible'} className='col-2'>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              By Bible
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="Placeholder" >Placeholder</Dropdown.Item>
              <Dropdown.Item eventKey="Old Testement" >Old Testement</Dropdown.Item>
              <Dropdown.Item eventKey="New Testement" >New Testement</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown onSelect={(eventKey, e)=>handleSelect(eventKey,e,'Theme')} id={'theme'} className='col-2'>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              By Theme
            </Dropdown.Toggle>
            <Dropdown.Menu className='scrollable-menu'>
              <Dropdown.Item eventKey="Need For The New Life" >Need For The New Life</Dropdown.Item>
              <Dropdown.Item eventKey="Sharing Our Faith" >Sharing Our Faith</Dropdown.Item>
              <Dropdown.Item eventKey="Suffering" >Suffering</Dropdown.Item>
              <Dropdown.Item eventKey="Human Government" >Human Government</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown onSelect={handleSelect} id={'book'} className='col-2'>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              By Book
            </Dropdown.Toggle>

            <Dropdown.Menu className='scrollable-menu'>

              <Dropdown.Item eventKey="placeholder" className="rojo">PLACEHOLDER</Dropdown.Item>
              <Dropdown.Header>Old Testament</Dropdown.Header>
              <Dropdown.Item eventKey="genesis">Genesis</Dropdown.Item>
              <Dropdown.Item eventKey="exodus">Exodus</Dropdown.Item>
              <Dropdown.Header>New Testament</Dropdown.Header>
              <Dropdown.Item eventKey="matthew">Matthew</Dropdown.Item>
              <Dropdown.Item eventKey="mark">Mark</Dropdown.Item>

            </Dropdown.Menu>
          </Dropdown>
          <Dropdown onSelect={handleSelect} id={'character'} className='col-2'>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              By Character
            </Dropdown.Toggle>

            <Dropdown.Menu className='scrollable-menu'>
              <Dropdown.Item eventKey="placeholder" className="rojo">PLACEHOLDER</Dropdown.Item>
              <Dropdown.Item eventKey="God">God</Dropdown.Item>
              <Dropdown.Item eventKey="Jesus">Jesus</Dropdown.Item>
              <Dropdown.Item eventKey="Moses">Moses</Dropdown.Item>
              <Dropdown.Item eventKey="Paul">Paul</Dropdown.Item>
              <Dropdown.Item eventKey="Elijah">Elijah</Dropdown.Item>
              <Dropdown.Item eventKey="Peter">Peter</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown onSelect={handleSelect} id={'prophet'} className='col-2'>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              By Prophet
            </Dropdown.Toggle>

            <Dropdown.Menu className='scrollable-menu'>
              <Dropdown.Item eventKey="placeholder" className="rojo">PLACEHOLDER</Dropdown.Item>
              <Dropdown.Item eventKey="isaiah">Isaiah</Dropdown.Item>
              <Dropdown.Item eventKey="jeremiah">Jeremiah</Dropdown.Item>
              <Dropdown.Item eventKey="ezekiel">Ezekiel</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className='mt-2 studies border border-primary border-4 rounded'>
        {currentStudy ? <h3>{currentStudy.title}</h3> : <h3>Select a Study</h3>}
        <WordStudy content={currentStudy} />
      </div>

      <div>
        <Form id="entry" onSubmit={submit}>
          <Form.Group controlId="myJournal">
            <Form.Label><strong>Notes On My Study</strong></Form.Label>
            <Form.Control
              as="textarea"
              className="form-control clear "
              placeholder="Enter your notes press Save to save notes"
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="btn btn-secondary mb-2">Save</Button>
        </Form>
      </div>

      <div className="myEntry">
        {journalEntries}
      </div>
      {/* End Parent Div */}
    </div>
  )
}

export default WalkWord
