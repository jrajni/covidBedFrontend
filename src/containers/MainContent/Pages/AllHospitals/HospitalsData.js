import React, { Component } from "react";
import AUX from "../../../../hoc/Aux_";
import io from "socket.io-client";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Config from "../../../../config";
import { Input, Table, Modal } from "antd";
const { Column } = Table;
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
            i.hospitalName
              .toLowerCase()
              .includes(this.state.nameBased.toLowerCase())
          ) {
            filteredData.push(i);
          }
        });
        this.setState({ filteredHospitals: filteredData });
      } else {
        this.state.hospitals.map((i) => {
          if (
            i.hospitalName
              .toLowerCase()
              .includes(this.state.nameBased.toLowerCase())
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
            i.location
              .toLowerCase()
              .includes(this.state.locationBased.toLowerCase())
          ) {
            filteredData.push(i);
          }
        });

        this.setState({ filteredHospitals: filteredData });
      } else {
        this.state.hospitals.map((i) => {
          if (
            i.location
              .toLowerCase()
              .includes(this.state.locationBased.toLowerCase())
          ) {
            filteredData.push(i);
          }
        });

        this.setState({ filteredHospitals: filteredData });
      }
    }
  };
  modalHandler = (record) => {
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
      console.log("insert", data);
      this.socketData(data);
    });
    socket.on("deleteHospital", (data) => {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
    socket.on("updateHospital", (data) => {
      this.socketData(data);
    });
  }
  socketData = async (data) => {
    let alreadyData = [...this.state.hospitals, data];
    await this.tableData(alreadyData);
  };
  tableData = async (tableData) => {
    const dataValues = [];
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
      <div className="container">
        <h3 className="text-center">COVID-VACANT BEDS </h3>
        <br />
        <div>
          <div className="m-2">
            <Input
              placeholder="Name of Hospital"
              style={{ width: "60%" }}
              name="nameBased"
              value={this.state.nameBased}
              onChange={this.inputHandler}
            />
            <button
              className="btn btn-primary text-center pt-1 pb-1 ml-4"
              onClick={this.nameBasedHandler}
            >
              Search
            </button>
          </div>
          <div className="m-2">
            <Input
              placeholder="Enter Location"
              style={{ width: "60%" }}
              name="locationBased"
              value={this.state.locationBased}
              onChange={this.inputHandler}
            />
            <button
              className="btn btn-primary text-center pt-1 pb-1 ml-4"
              onClick={this.locationBasedHandler}
            >
              Search
            </button>
          </div>
        </div>
        <div>
          <button
            className="btn btn-secondary text-center m-2"
            onClick={this.resetHandler}
          >
            Reset / Refresh
          </button>
        </div>
        <Modal
          title="Hospital Data"
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Name : {this.state.currentHospitalData.hospitalName}</p>
          <p>Address : {this.state.currentHospitalData.address}</p>
          <p>Location : {this.state.currentHospitalData.location}</p>
          <p>
            Beds Available : {this.state.currentHospitalData.noOfBedsAvailable}
          </p>
          <p>
            Price per bed : {this.state.currentHospitalData.priceOfSingleBed}
          </p>

          <p>Contact : {this.state.currentHospitalData.contact}</p>
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
            title="Beds Available"
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
