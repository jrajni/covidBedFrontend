import React, { Component } from "react";
import Layout from "./components/Layout/Layout";
import { Suspense, lazy, Fragment } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AUX from "./hoc/Aux_";
import PrivateRoute from "./routing/privateRoute";
import Sampler from "./containers/MainContent/Pages/sampler";
const Register = lazy(() =>
  import("./containers/MainContent/Pages/Pages_register")
);
const Login = lazy(() => import("./containers/MainContent/Pages/Pages_login"));
const Dashboard = lazy(() =>
  import("./containers/MainContent/Dashboard/Dashboard1")
);
const UpdateData = lazy(() =>
  import("./containers/MainContent/Dashboard/updateData")
);
const AllHospitals = lazy(() =>
  import("./containers/MainContent/Pages/AllHospitals/HospitalsData")
);
class App extends Component {
  render() {
    let layout = null;

    layout = (
      <Fragment>
        <Suspense
          fallback={
            <div className="loader-container">
              <div className="loader-container-inner">
                <div className="text-center">Loading...</div>
              </div>
            </div>
          }
        >
          <Layout
            header={this.props.header}
            sidebar={this.props.sidebar}
            footer={this.props.footer}
            loginpage={this.props.loginpage}
          >
            <Switch>
              <Route exact path="/all-hospitals" component={AllHospitals} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route path="/sampler" component={Sampler} />
              {/* Dashboards */}
              <PrivateRoute path="/dashboard" component={Dashboard} />
              {/* Special Client Features*/}
              <PrivateRoute path="/updateData" component={UpdateData} />
              {/* Site Reports Features*/}
              {/*Admin Dashboards */}
              {/* <PrivateRoute path="/admindashboard" component={AdminDashboards} /> */}
              {/* Settings */}
              {/* <PrivateRoute path="/settings" component={Settings} /> */}
              {/* Configurations */}
              {/* <PrivateRoute path="/configurations" component={Configurations} /> */}
              {/* Crowd-Safety */}
              {/* <PrivateRoute path="/crowd-safety" component={CrowdSafetyAnalytics} /> */}
              {/* Automated-Queue */}
              {/* <PrivateRoute
            path="/automated-queue"
            component={AutomatedQueueManagement}
          /> */}
              {/* Retail-Analytics */}
              {/* <PrivateRoute path="/retail-analytics" component={RetailAnalytics} /> */}
              {/* First Page */}
              <Route exact path="/" render={() => <Redirect to="/login" />} />
              {/* Not Found URL */}
              {/* <Route component={NotFound} /> */}
            </Switch>{" "}
          </Layout>
        </Suspense>
      </Fragment>
    );
    return <AUX>{layout}</AUX>;
  }
}
const mapStatetoProps = (state) => {
  return {
    header: state.auth.header,
    sidebar: state.auth.sidebar,
    footer: state.auth.footer,
    loginpage: state.loginpage,
  };
};

export default withRouter(connect(mapStatetoProps)(App));
