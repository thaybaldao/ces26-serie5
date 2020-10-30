import React, { Component } from 'react';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import validator from "validator";
import $ from 'jquery';

const number = (value) => {
  if (!validator.isNumeric(value)) {
    return (
      <div className="alert alert-danger" role="alert" style={{marginTop: "5px"}}>
        {`${value} não é uma sequência de números.`}
      </div>
    );

  }
};

const over18 = (value) => {
  if (value < 18) {
    return (
      <div className="alert alert-danger" role="alert" style={{marginTop: "5px"}}>
        {`You must be over 18.`}
      </div>
    );

  }
};

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert" style={{marginTop: "5px"}}>
        Este campo é obrigatório!
      </div>
    );
  }
};

class AgeForm extends Component {
  constructor(props) {
      super(props);
      this.state = { name: '', age: ''};
  }
  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

  mySubmitHandler = async e => {
    this.form.validateAll();
    e.preventDefault();
    if(this.state.name !== "" && Number(this.state.age) && this.state.age > 18){
      $.ajax({
        url: "http://localhost:5000/submit",
        type: 'POST',
        data: this.state,
        dataType: 'json'
      }).done((data)=> {
         $("#info").html("<h5>Info submitted:</h5><ul><li>Name: " + data.name + "</li><li>Age: " + data.age + "</li><ul>");
      }).fail(()=> {
        $("#info").html("An error occured while submitting form.");
      });
    }
  };

  handleClick(){
    $.ajax({
      url: "http://localhost:5000/submissions",
      type: 'GET',
      dataType: 'json'
    }).done((data)=> {
      var table = "<table><tr><th>Name</th><th>Age</th></tr>";

      var i;
      for(i = 0; i < data.length; ++i){
        table += "<tr><td>"+data[i].name+"</td><td>"+data[i].age+"</td></tr>"
      }
      table += "</table>"

      $("#table").html(table);
    }).fail(()=> {
      $("#table").html("An error occured while retrieving data.");
    });
  }


  render() {
    return (
      <div style={{maxWidth:"50%"}}>
          <Form onSubmit={this.mySubmitHandler} ref={c => { this.form = c; }}>
            <div className="form-group">
              <label>Name:</label>
              <Input type="text" className="form-control" name='name' value={this.state.name} onChange={this.myChangeHandler} validations={[required]}/>
            </div>

            <div className="form-group">
              <label>Age:</label>
              <Input type="text" className="form-control" name='age' value={this.state.age} onChange={this.myChangeHandler} validations={[required, number, over18]}/>
            </div>

            <Input type='submit' className="btn btn-primary" value='SUBMIT'/>
          </Form>
          <br/>
          <div id="info"></div>
          <br/>
          <button className="btn btn-primary" onClick={this.handleClick}>Check all form submissions</button>

          <div id="table" style={{marginTop:"25px"}}></div>
        </div>
    );
  }
}

export default AgeForm;
