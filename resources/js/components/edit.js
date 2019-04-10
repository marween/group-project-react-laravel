import React, { Component } from 'react';
import { updateEvent } from './helpers';
import { appGetEventByIDEdit } from './helpers';
import { convertDate } from './helpers';
import Form from 'react-bootstrap/Form';
import { Calendar } from 'primereact/calendar';
import Button from 'react-bootstrap/Button';

export default class DisplayEvent extends Component {

  constructor(props) {
    super(props);
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    let nextMonth = (month === 11) ? 0 : month + 1;
    let nextYear = (nextMonth === 0) ? year + 1 : year;

    let minDate = new Date();
    minDate.setMonth(prevMonth);
    minDate.setFullYear(prevYear);
    let maxDate = new Date();
    maxDate.setMonth(nextMonth);
    maxDate.setFullYear(nextYear);
    this.validateForm = this.validateForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dateTemplate = this.dateTemplate.bind(this);
    this.input = React.createRef();
    this.state = {

      eventList: [],
      suscribersList: [],
      boxSubscribe : false,
      idEvent: this.props.match.params.id,
      name: "",
      description: "",
      image_url: "",
      date_event: "",
      reminder: "",
      thisDay: today,
      minDate: minDate,
      maxDate: maxDate,
      invalidDates: [today],
      boxReminder: false
    }

  }//\constructor

  componentDidMount() {
    appGetEventByIDEdit(this.props.match.params.id, this);
  }

  /* form validation*/
    validateForm() {
      return this.state.name.length > 0 && this.state.description.length > 0;
    }//\end fct validateForm

  /*onchanges*/
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value});
        if (target.checked === true){
          document.getElementsByName("calendarDisplay")[0].style.display = "block";
        } else {
          document.getElementsByName("calendarDisplay")[0].style.display = "none";
        }
    }//\end fct handleChange

  /* date conversion + submit*/
    handleSubmit() {
      //console.log(JSON.stringify(this.state.image_url));
      let urlToSend = this.state.image_url;
      if (urlToSend === ""){
        //console.log("no img");
        urlToSend = "logo";
      }
      let convertedDate = convertDate (this.state.date_event);
      let convertedReminder ="";
      let datetest  = new Date();
      //check if box reminder is checked and not empty
      if (this.state.boxReminder && this.state.reminder !== null){
        convertedReminder = convertDate (this.state.reminder);
      }
      else{
        convertedReminder = "";
      }
      let myJSON = { "name": this.state.name, "date_event": convertedDate , "description": this.state.description, "reminder": convertedReminder, "image_url": urlToSend}
      //console.log(myJSON);
      event.preventDefault()
      updateEvent(this.state.idEvent,myJSON);
    }//\end fct handleSubmit

  /*used by component calendar*/
    dateTemplate(date) {
      if (date.day > 10 && date.day < 15) {
        return (
          <div style={{ backgroundColor: '#1dcbb3', color: '#ffffff', fontWeight: 'bold', borderRadius: '50%', width: '2em', height: '2em', lineHeight: '2em', padding: 0 }}>{date.day}</div>
        );
      }
      else {
        return date.day;
      }
    }

  render() {
    const { eventList } = this.state;
    const authorArticle = this.state.eventList.map(item => item.author);

    return (
      <Form onSubmit={this.handleSubmit} className="m-5">
      <h1>Update event</h1>
      <div className="m-2 m-sm-5 p-2 p-xl-5">
          <div>
            {this.state.eventList.map(item =>
              <div key={item.id} className="w-100  ">
              <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Title</Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    value={this.state.name}
                    placeholder="your event title"
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    name="description"
                    placeholder="your event description"
                    as="textarea" rows="10"
                    value={this.state.description}
                    onChange={this.handleChange}
                  />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Add an image</Form.Label>
                      <Form.Control
                      name="image_url"
                      type="url"
                      value={this.state.image_url}
                      pattern="(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)"
                      placeholder="paste an url"
                      onChange={this.handleChange}
                      />
                    </Form.Group>
                    <div className="p-col-12 mt-3">
                        <p>Date of event:</p>
                        <Calendar
                        dateFormat="yy/mm/dd"
                        value={this.state.date_event}
                        onChange={(e) => this.setState({ date_event: e.value })}
                        readOnlyInput={true}
                        minDate={new Date()}
                        showTime={true}
                        timeOnly={false}
                        hourFormat="24"
                        showIcon={true}
                        showSeconds={true}
                        />
                    </div>
                    <div className="p-col-12 mt-3">
                      <div className="form-check">
                        <input className="form-check-input"
                        type="checkbox"
                        name="boxReminder"
                        checked={this.state.boxReminder}
                        onChange={this.handleChange} />
                        <label className="form-check-label">
                          Send a reminder to users who suscribed
                        </label>
                      </div>
                      <div style={{display:'none'}} name="calendarDisplay">
                        <Calendar
                        dateFormat="yy/mm/dd"
                        value={this.state.reminder}
                        onChange={(e) => this.setState({ reminder: e.value })}
                        readOnlyInput={true}
                        showTime={true}
                        timeOnly={false}
                        hourFormat="24"
                        showIcon={true}
                        showSeconds={true}
                        />
                      </div>
                    </div>

              </div>
            )}
          </div>
        </div>
        <Button disabled={!this.validateForm()} className="my-3" type="submit">Submit</Button>
        </Form>
    )
  }
}
