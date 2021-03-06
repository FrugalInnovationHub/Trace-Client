import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import SerializeForm from 'form-serialize';
import { Link } from "react-router-dom";
import { Button, Form, Grid, Header, Segment, Message } from 'semantic-ui-react';
import AuthService from '../../utils/AuthService.js';

const auth = new AuthService();

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loginError: '',
      redirectToReferrer: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const {email, password} = SerializeForm(e.target, { hash: true });
    this.setState({email, password});
    //Login user
    auth.login(email, password)
    .then(result => {
      if (!result.token) {
        this.setState({loginError: result.message})
        return;
      }

      auth.finishAuthentication(result.token);
      this.setState(() => ({
        redirectToReferrer: true
      }));

    });
  }

  render() {
    const { redirectToReferrer, loginError } = this.state;
    if (redirectToReferrer === true) {
      return <Redirect to='/product' />;
    }

    return(
      <div className='login-form' style={{ paddingTop: '15%' }}>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
              Login
            </Header>
            <Form size='large' onSubmit={this.handleSubmit} id="login-form">
              <Segment>
                <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' name='email'/>
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  name='password'
                />

                <Button color='teal' fluid size='large'>
                  Login
                </Button>
              </Segment>
              <Segment>
                <Button color='teal' fluid size='large' as={ Link } to='/signup'>
                  Create Account
                </Button>
              </Segment>
              {
                this.state.loginError && ( <Message error list={[{loginError}]}/>)
              }

            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}


export default Login;