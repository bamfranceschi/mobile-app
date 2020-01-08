
import React, { useEffect, useState } from "react"
import DatePicker from 'react-native-datepicker'
import axios from "axios"
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  TextInput,
  Picker,
  CheckBox
} from "react-native";
import { connect } from "react-redux";
import * as SecureStore from 'expo-secure-store';

import getEnvVars from '../../../environment';
const { familyConnectionsURL } = getEnvVars()


function EditConnectionForm(props) {
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState(props.details);


  SecureStore.getItemAsync('cok_access_token').then(res => {
    setToken(res)
  }).catch(err => { console.log(err) })

  function handleChange(name, value, index = 0) {

    setFormData(formData => {
      return {
        ...formData,
        [name]: value
      }
    })

  }

  function handleSave() {
    const form = new FormData();
    form.append("person", JSON.stringify(formData));

    axios
      .patch(`${familyConnectionsURL}/api/v1/individualperson/${props.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      })
      .then(res => {
        console.log("(PATCH)person edited: ", res.data);
      })
      .catch(err => {
        console.log("Unable to edit person", err);
      })
  }

  function handleNew(name) {
    setFormData(formData => {
      let shape;
      switch (name) {
        case "addresses":
          shape = {
            "country": "", "country_code": "", "formatted": "", "is_verified": false, "latitude": 0, "locality": "", "longitude": 0,
            "postal_code": "", "raw": "", "route": "", "state": "", "state_code": "", "street_number": ""
          }
          break
        case "emails":
          shape = { email: "", "is_verified": false }
          break
        case "telephones":
          shape = { "telephone": "", "is_verified": false }
          break
      }
      return {
        ...formData,
        [name]: [...formData[name], shape]
      }

    })
  }

  return (

    <View style={styles.container}>
      <View style={styles.header}><Text>INFORMATION</Text></View>

      <Text>First Name</Text>
      <TextInput style={styles.textInput} value={formData["first_name"]} placeholder="First Name"
        onChangeText={text => handleChange("first_name", text)} />

      <Text>Middle Name</Text>
      <TextInput style={styles.textInput} value={formData["middle_name"]} placeholder="Middle Name"
        onChangeText={text => handleChange("middle_name", text)} />

      <Text>Last Name</Text>
      <TextInput style={styles.textInput} value={formData["last_name"]} placeholder="Last Name"
        onChangeText={text => handleChange("last_name", text)} />

      <Text>Suffix</Text>
      <TextInput style={styles.textInput} value={formData["suffix"]} placeholder="Not Specified"
        onChangeText={text => handleChange("suffix", text)} />

      <View style={styles.dob_gen}>
        <Text>Date of Birth</Text>
        <DatePicker
          date={formData.birthday} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="select date"
          format="DD-MM-YYYY"
          minDate=""
          maxDate=""
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
            },
          }}
          onDateChange={date => handleChange("birthday", date)}
        />

        <Text>Gender</Text>
        <Picker selectedValue={formData["gender"]} onValueChange={gender => handleChange("gender", gender)}>
          <Picker.Item label="male" value="M" />
          <Picker.Item label="female" value="F" />
          <Picker.Item label="other" value="O" />
        </Picker>

      </View>

      <Text>Deceased</Text>
      <CheckBox value={formData.deceased}
        onChange={deceased => handleChange("deceased", deceased)} />

      <View style={styles.header}><Text>Contact Details</Text></View>


      <Text>Residence</Text>
      {formData.addresses && formData.addresses.map((val, i) => {
        return (
          <>
            <Text>Street Address 1</Text>
            <TextInput style={styles.textInput} value={val.route} placeholder="Street Address 1" />
            <Text>Street Address 2</Text>
            <TextInput style={styles.textInput} value={val.raw} placeholder="Street Address 2" />

            <View style={styles.addressDetail}>
              <Text>City</Text>
              <TextInput style={styles.textInput} value={val.locality} placeholder="City" />

              <Text>State</Text>
              <TextInput style={styles.textInput} value={val.state} placeholder="State" />

              <Text>Zip Code</Text>
              <TextInput style={styles.textInput} value={val["postal_code"]} placeholder="Zip Code" />

              <Text>Country</Text>
              <TextInput style={styles.textInput} value={val.country} placeholder="Country" />
            </View>
          </>
        )
      })}

      <TouchableOpacity style={styles.addButton} onPress={e => handleNew("addresses")}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      <Text>Telephone</Text>
      {formData.telephones && formData.telephones.map((val, i) => {
        return <TextInput style={styles.textInput} key={i} value={val.telephone} placeholder="000-000-0000" />
      })}
      <TouchableOpacity style={styles.addButton} onPress={e => handleNew("telephones")}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      <Text>Email</Text>
      {formData.emails && formData.emails.map((val, i) => {
        return <TextInput style={styles.textInput} key={i} value={val.email} placeholder="name@mail.com" />
      })}
      <TouchableOpacity style={styles.addButton} onPress={e => handleNew("emails")}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      <Text>Job Title</Text>
      <TextInput style={styles.textInput} value={formData["job_title"]}
        onChangeText={text => handleChange("job_title", text)} placeholder="Job Title" />

      <Text>Employer</Text>
      <TextInput style={styles.textInput} value={formData["employer"]}
        onChangeText={text => handleChange("employer", text)} placeholder="Company Name" />

      <Text>Salary Range</Text>
      <Picker selectedValue={formData["salary_range"]}
        onValueChange={salary => handleChange("salary_range", salary)} >
        <Picker.Item label="unknown" value="unknown" />
        <Picker.Item label="<$40,000" value="<$40,000" />
        <Picker.Item label="$40,001-$80,000" value="$40,001-$80,000" />
        <Picker.Item label="$81,001-$120,000" value="$81,001-$120,000" />
        <Picker.Item label="$120,001-$160,000" value="$120,001-$160,000" />
        <Picker.Item label="$160,001-$200,000" value="$160,001-$200,000" />
        <Picker.Item label="$200,000+" value="$200,000+" />
      </Picker>

      <View style={styles.header}><Text>Social Media</Text></View>

      <Text>Facebook</Text>
      <TextInput style={styles.textInput} value={formData["facebook"]}
        onChangeText={text => handleChange("facebook", text)} placeholder="Facebook" />

      <Text>Twitter</Text>
      <TextInput style={styles.textInput} value={formData["twitter"]}
        onChangeText={text => handleChange("twitter", text)} placeholder="Twitter" />

      <Text>LinkedIn</Text>
      <TextInput style={styles.textInput} value={formData["linkedin"]}
        onChangeText={text => handleChange("linkedin", text)} placeholder="LinkedIn" />

      <Button onPress={handleSave} title="save" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
  },
  header: {
    marginTop: 50,
    marginBottom: 30,
    borderBottomColor: "silver",
    borderBottomWidth: 2,
    color: "silver",
    fontSize: 2
  },
  textInput: {
    flex: 1,
    color: "black",
    borderColor: "silver",
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    margin: 10
  },
  dob_gen: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  addButton: {
    backgroundColor: "#0279AC",
    borderRadius: 20,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: "white"
  },
  addressDetail: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  addressInput: {
    flex: 1,
    color: "black",
    borderColor: "silver",
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    margin: 10,
    width: "45%"
  }
})

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps, {})(EditConnectionForm); 
