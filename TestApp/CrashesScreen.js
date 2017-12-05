/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import { DialogComponent } from 'react-native-dialog-component';
import ImagePicker from 'react-native-image-picker';

import Crashes from 'appcenter-crashes';
import { FooClass } from './js/FooClass';
import SharedStyles from './SharedStyles';
import AttachmentsProvider from './AttachmentsProvider';

export default class CrashesScreen extends Component {
  constructor() {
    super();
    this.state = {
      crashesEnabled: false,
      lastSessionStatus: '',
      sendStatus: '',
      textAttachment:'',
      binaryAttachment:''
    };
    this.toggleEnabled = this.toggleEnabled.bind(this);
    this.jsCrash = this.jsCrash.bind(this);
    this.nativeCrash = this.nativeCrash.bind(this);
    this.showFilePicker = this.showFilePicker.bind(this);
  }

  async componentDidMount() {
    let status = '';
    const component = this;

    const crashesEnabled = await Crashes.isEnabled();
    component.setState({ crashesEnabled });

    const crashedInLastSession = await Crashes.hasCrashedInLastSession();

    status += `Crashed: ${crashedInLastSession ? 'yes' : 'no'}\n\n`;
    component.setState({ lastSessionStatus: status });

    if (crashedInLastSession) {
      const crashReport = await Crashes.lastSessionCrashReport();

      status += JSON.stringify(crashReport, null, 4);
      component.setState({ lastSessionStatus: status });
    }

     const textAttachment = await AttachmentsProvider.getTextAttachment();
     component.setState({textAttachment: textAttachment});

     const binaryAttachment = await AttachmentsProvider.getBinaryAttachmentInfo();
     component.setState({binaryAttachment: binaryAttachment});
  }

  async toggleEnabled() {
    await Crashes.setEnabled(!this.state.crashesEnabled);

    const crashesEnabled = await Crashes.isEnabled();
    this.setState({ crashesEnabled });
  }

  jsCrash() {
    const foo = new FooClass();
    foo.method1();
  }

  nativeCrash() {
    Crashes.generateTestCrash();
  }

  render() {
    return (
      <View style={SharedStyles.container}>
        <ScrollView>
          <Text style={SharedStyles.heading}>
            Test Crashes
          </Text>
          <Text style={SharedStyles.enabledText}>
            Crashes enabled: {this.state.crashesEnabled ? 'yes' : 'no'}
          </Text>
          <TouchableOpacity onPress={this.toggleEnabled}>
            <Text style={SharedStyles.toggleEnabled}>
              toggle
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.jsCrash}>
            <Text style={styles.button}>
              Crash JavaScript
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.nativeCrash}>
            <Text style={styles.button}>
              Crash native code
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.dialogComponent.show()}}>
          <Text style={styles.button}>
              Set text attachmet
          </Text>
          </TouchableOpacity>
          <Text style={SharedStyles.enabledText}>{'Current value:'}{this.state.textAttachment}</Text>
          <TouchableOpacity onPress={this.showFilePicker}>
          <Text style={styles.button}>
              Set file attachmet
          </Text>
          </TouchableOpacity>
          <Text style={SharedStyles.enabledText}>{'Current value:'}{this.state.binaryAttachment}</Text>
          <Text style={styles.lastSessionHeader}>Last session:</Text>
          <Text style={styles.lastSessionInfo}>
            {this.state.lastSessionStatus}
          </Text>
        </ScrollView>
        {this.getTextAttachmentDialog()}
      </View>
    );
  }

  getTextAttachmentDialog() {
    return(                
      <DialogComponent 
        ref={(dialogComponent) => { this.dialogComponent = dialogComponent; }}
        width={0.9}>
        <View>
            <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, margin: 8}}
            onChangeText = {(text) => this.setState({ textAttachment: text })}/>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
            <TouchableOpacity
                style={{height:50}}
                onPress={() => {
                    AttachmentsProvider.saveTextAttachment(this.state.textAttachment);
                    this.dialogComponent.dismiss();
                }}>
                <Text style={styles.button}>
                Save
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{height:50}}
                onPress={() => {this.dialogComponent.dismiss()}}>
                <Text style={styles.button}>
                Cancel
                </Text>
            </TouchableOpacity>
            </View>
        </View>
      </DialogComponent>
    );
  }

  showFilePicker() {
    ImagePicker.showImagePicker(null, async (response) => {    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else {
        AttachmentsProvider.saveBinaryAttachment(getFileName(response), response.data, getFileType(response), getFileSize(response));
        let binaryAttachment = await AttachmentsProvider.getBinaryAttachmentInfo()
        this.setState({ binaryAttachment: binaryAttachment });
      }
    });

    function getFileName(response) {
      return response.fileName != null ? response.fileName : 'binary.jpeg';
    }

    function getFileType(response) {
      return response.type != null ? response.type : 'image/jpeg';
    }

    function getFileSize(response) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (response.fileSize == 0) return '0 Byte';
      var i = parseInt(Math.floor(Math.log(response.fileSize) / Math.log(1024)));
      return Math.round(response.fileSize / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
  }
}


const styles = StyleSheet.create({
  button: {
    color: '#4444FF',
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
  lastSessionHeader: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30
  },
  lastSessionInfo: {
    fontSize: 14,
    textAlign: 'center',
  },
});
