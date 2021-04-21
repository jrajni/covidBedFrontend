import React, { Component } from "react";
import AUX from "../../../../hoc/Aux_";
import io from "socket.io-client";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Config from "../../../../config";
import { Table, Modal } from "antd";
const { Column } = Table;
const dataValues = [];
class Dashboard extends Component {
  state = {
    hospitals: [],
    originalData: [],
    filteredHospitals: [],
    nameBased: "",
    locationBased: "",
    isModalVisible: false,
    currentHospitalData: {},
  };
  getTodayZoneBasedData = async (id) => {
    try {
      await axios.get(`${Config.hostName}/api/hospital`).then(async (res) => {
        await this.tableData(res.data);
        //   this.setState({ hospitals: res.data });
      });
    } catch (error) {
      console.log("error contact", error);
    }
  };
  inputHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  nameBasedHandler = (e) => {
    if (this.state.nameBased == "") {
      this.setState({ filteredData: [] });
    } else {
      let filteredData = [];
      if (this.state.filteredHospitals.length > 1) {
        this.state.filteredHospitals.map((i) => {
          if (
            i.hospitalName.toLowerCase() === this.state.nameBased.toLowerCase()
          ) {
            filteredData.push(i);
          }
        });
        this.setState({ filteredHospitals: filteredData });
      } else {
        this.state.hospitals.map((i) => {
          if (
            i.hospitalName.toLowerCase() === this.state.nameBased.toLowerCase()
          ) {
            filteredData.push(i);
          }
        });
        this.setState({ filteredHospitals: filteredData });
      }
    }
  };
  locationBasedHandler = (e) => {
    if (this.state.locationBased == "") {
      return;
    } else {
      let filteredData = [];
      if (this.state.filteredHospitals.length > 1) {
        this.state.filteredHospitals.map((i) => {
          if (
            i.location.toLowerCase() === this.state.locationBased.toLowerCase()
          ) {
            filteredData.push(i);
          }
        });

        this.setState({ filteredHospitals: filteredData });
      } else {
        this.state.hospitals.map((i) => {
          if (
            i.location.toLowerCase() === this.state.locationBased.toLowerCase()
          ) {
            filteredData.push(i);
          }
        });

        this.setState({ filteredHospitals: filteredData });
      }
    }
  };
  modalHandler = (record) => {
    console.log("record", record);
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      currentHospitalData: record,
    });
  };
  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };
  handleOk = () => {
    this.setState({ isModalVisible: false });
  };
  resetHandler = () => {
    this.getTodayZoneBasedData();

    this.setState({ locationBased: "", nameBased: "", filteredHospitals: [] });
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
    if (tableData.length) {
      await tableData.map((i, index) => {
        i.noOfBedsAvailable = i.alteredData.noOfBedsAvailable;
        i.priceOfSingleBed = i.alteredData.priceOfSingleBed;
        i.key = index + 1;
        dataValues.push(i);
      });
      await this.setState({ hospitals: dataValues, originalData: dataValues });
      console.log("datavalues", this.state.hospitals);
    }
  };
  render() {
    return (
      <div className="row pl-0 pr-0">
        <div className="" />
        <h3>Hospital Bed Finder </h3>
        <div style={{ marginBottom: "20px" }}>
          <input
            placeholder="Search Name of hospital"
            width="100%"
            name="nameBased"
            value={this.state.nameBased}
            onChange={this.inputHandler}
          />
          &emsp;
          <button
            className="btn btn-primary text-center"
            onClick={this.nameBasedHandler}
          >
            Search
          </button>
        </div>
        <div>
          <input
            placeholder="Location Search"
            width="100%"
            name="locationBased"
            value={this.state.locationBased}
            onChange={this.inputHandler}
          />
          &emsp;
          <button
            className="btn btn-primary text-center"
            onClick={this.locationBasedHandler}
          >
            Search
          </button>
        </div>
        <div>
          <button
            className="btn btn-primary text-center"
            onClick={this.resetHandler}
          >
            Reset/Refresh
          </button>
        </div>
        <Modal
          title="Hospital Data"
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Name :&emsp; {this.state.currentHospitalData.hospitalName}</p>
          <p>Address :&emsp;{this.state.currentHospitalData.address}</p>
          <p>Location : &emsp;{this.state.currentHospitalData.location}</p>
          <p>
            Beds Available :&emsp;{" "}
            {this.state.currentHospitalData.noOfBedsAvailable}
          </p>
          <p>
            Price per bed : &emsp;
            {this.state.currentHospitalData.priceOfSingleBed}
          </p>

          <p>{this.state.currentHospitalData.contact}</p>
        </Modal>
        <Table
          // pagination={{
          //   defaultPageSize: 10,
          //   showSizeChanger: true,
          //   pageSizeOptions: ["10", "20", "30"],
          // }}
          id="my-table"
          dataSource={
            this.state.filteredHospitals.length > 0
              ? this.state.filteredHospitals
              : this.state.hospitals
          }
          scroll={{ x: 200 }}
        >
          <Column title="Serial No." dataIndex="key" key="key" />

          <Column
            title="Hospital Name"
            dataIndex="hospitalName"
            key="hospitalName"
            render={(text, record) => (
              <span>
                <a href="#" onClick={() => this.modalHandler(record)}>
                  {record.hospitalName}
                </a>
              </span>
            )}
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
    );
  }
}

export default Dashboard;
