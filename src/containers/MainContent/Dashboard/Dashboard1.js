import React, { Component } from "react";
import AUX from "../../../hoc/Aux_";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import io from "socket.io-client";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Config from "../../../config";
import { Table } from "antd";
const { Column } = Table;
const dataValues = [];
class Dashboard extends Component {
  state = {
    hospitals: [],
  };
  getTodayZoneBasedData = async (id) => {
    try {
      await axios
        .get(`${Config.hostName}/api/hospital`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-auth-token": this.props.auth.token,
          },
        })
        .then(async (res) => {
          await this.tableData(res.data);
          //   this.setState({ hospitals: res.data });
        });
    } catch (error) {
      console.log("error contact", error);
    }
  };
  componentDidMount() {
    this.getTodayZoneBasedData();
    const socket = io(`${Config.hostName}/api/socket`, {
      pingInterval: 60000,
      pingTimeout: 180000,
      cookie: false,
      origins: "*:*",
      secure: true,
      transports: ["flashsocket", "polling", "websocket"],
      upgrade: false,
      reconnection: true,
    });
    socket.on("insertHospital", (data) => {
      this.socketData(data);
    });
    socket.on("deleteHospital", (data) => {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
    socket.on("updateHospital", (data) => {
      this.PusherComponent(data);
    });
  }
  socketData = async (data) => {
    let alreadyData = this.state.hospitals;
    alreadyData = [...alreadyData, data];
    await this.tableData(alreadyData);
  };
  tableData = async (tableData) => {
    console.log("TableDa", tableData);
    if (tableData.length) {
      await tableData.map((i, index) => {
        i.noOfBedsAvailable = i.alteredData.noOfBedsAvailable;
        i.priceOfSingleBed = i.alteredData.priceOfSingleBed;
        i.key = index + 1;
        dataValues.push(i);
      });
      await this.setState({ hospitals: dataValues });
      console.log("datavalues", this.state.hospitals);
    }
  };
  render() {
    return (
      <AUX>
        <div className="page-content-wrapper">
          <div className="container-fluid" />
          <Table
            // pagination={{
            //   defaultPageSize: 10,
            //   showSizeChanger: true,
            //   pageSizeOptions: ["10", "20", "30"],
            // }}
            id="my-table"
            dataSource={this.state.hospitals}
          >
            <Column title="Serial No." dataIndex="key" key="key" />

            <Column
              title="Hospital Name"
              dataIndex="hospitalName"
              key="hospitalName"
            />
            <Column title="Location" dataIndex="location" key="location" />
            <Column title="Address" dataIndex="address" key="address" />
            <Column title="Contact" dataIndex="contact" key="contact" />

            <Column
              title="No Of Beds Available"
              dataIndex="noOfBedsAvailable"
              key="noOfBedsAvailable"
            />
            <Column
              title="Price Of Single Bed"
              dataIndex="priceOfSingleBed"
              key="priceOfSingleBed"
            />
          </Table>
        </div>
      </AUX>
    );
  }
}

const mapStatetoProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStatetoProps)(Dashboard);
