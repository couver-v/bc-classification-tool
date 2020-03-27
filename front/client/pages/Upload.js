import React, { Component } from 'react';
import Select from 'react-select';
import Colors from '../Colors';
import CropImage from '../components/CropImage';
import Button from '../components/Button';
import { FiCheck } from 'react-icons/fi';
import Navbar from '../components/Navbar';
var d3 = require("d3");


class Upload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filenames: [],
            showResult: false,
            showCrop: false,
            canSubmit: false,
            cropId: 0,
            location: 'not-specified',
            subtype: 'not-specified',
            grade: 'not-specified',
            residualCarcinoma: 'not-specified',
            invasiveCarcinoma: 'not-specified',
            chronicInflammation: 'not-specified',
            trustedCode: '',
            age: '',
        }
        this.images = [];
        this.bboxes = []
        this.fileInput = React.createRef();
    }

    reset() {
        this.setState({ filenames: [], showResult: false, showCrop: false, canSubmit: false, cropId: 0 })
        this.images = [];
        this.bboxes = []
    }

    handleSubmit(event) {
       
    }

    onAgeChange(event) {
        this.setState({ age: event.target.value });
    }

    onLocationChange(value) {
        this.setState({ location: value });
    }

    onSubtypeChange(value) {
        this.setState({ subtype: value });
    }

    onGardeChange(value) {
        this.setState({ grade: value });
    }

    onResidualCarcinomaChange(value) {
        this.setState({ residualCarcinoma: value });
    }

    onInvasiveCarcinomaChange(value) {
        this.setState({ invasiveCarcinoma: value });
    }

    onChronicInflammationChange(value) {
        this.setState({ chronicInflammation: value });
    }

    onTrustedCodeChange(event) {
        this.setState({ trustedCode: event.target.value });
    }

    onImageChange(event) {
        this.reset()
        const filenames = []
        for (let i = 0; i < event.target.files.length; i++) {
            const element = event.target.files[i];
            filenames.push(element.name)
        }

        this.setState({ 
            filenames,
            showResult: false
        })

        this.files = event.target.files;
        this.imId = 0

        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.images.push(reader.result)
                this.imId += 1
                if (this.files.length > this.imId) {
                    reader.readAsDataURL(this.files[this.imId]);
                } else {
                    this.setState({ showCrop: true })
                }
            });
            reader.readAsDataURL(this.files[this.imId]);
          }
    }

    renderFilenames() {
        if (this.state.filenames.length === 0) {
            return (
                <p style={styles.pStyle}>No image selected.</p>
            )
        }
        return (
        <div>
            {this.state.filenames.map((d, idx) => {
                return (<li style={styles.filenameStyle} key={idx}><p style={styles.pStyle}>{d}</p>{idx < this.state.cropId ? <FiCheck style={styles.checkIconStyle} /> : ''}</li>)
            })}
        </div>
        );
    }

    renderSelect(title, options, value, onSelect) {
        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <p style={{ ...styles.inputTextStyle, color: Colors.DarkGray, marginRight: 20 }}>{title}</p>
                <Select
                    value={value}
                    onChange={onSelect}
                    options={options}
                    defaultValue={'not-specified'}
                    styles={{ 
                        menu: (provided) => { return { ...provided, width: 250 }},
                        container: (provided) => { return { ...provided, width: 250, marginBottom: 30, }},
                        option: (provided) => { return { ...provided, fontFamily: 'Verdana', fontSize: 20 }},
                        placeholder: (provided) => { return { ...provided, fontFamily: 'Verdana', fontSize: 20 }},
                        singleValue: (provided) => { return { ...provided, fontFamily: 'Verdana', fontSize: 20 }},
                    }}
                />
            </div>
        )
    }

    renderTextInput(title, value, onChange) {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 25 }}>
                <p style={{ ...styles.inputTextStyle, color: Colors.DarkGray, marginRight: 20 }}>{title}</p>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    style={{ fontSize: 20, fontFamily: 'Verdana', paddingLeft: 10, paddingRight: 10 }}
                />
            </div>
        )
    } 

    renderForm() {
        return (
            <form
                onSubmit={this.handleSubmit.bind(this)}
                className="uploader"
                encType="multipart/form-data"
                style={styles.formStyle}
            >
                <div style={{ margin: 25 }}>
                    <label style={styles.inputStyle}>
                        <p style={styles.inputTextStyle}>CHOOSE ULTRASOUNDS</p>
                        <input
                            accept="image/*"
                            style={{ display: 'none'}}
                            type="file" multiple
                            ref={this.fileInput}
                            onChange={this.onImageChange.bind(this)}
                        />
                    </label>
                    {this.renderFilenames()}
                    <br />
                    {this.renderCrop()}
                    {this.renderTextInput(
                        'Patient\'s age:',
                        this.state.age,
                        this.onAgeChange.bind(this)
                    )}
                    {this.renderSelect(
                        'Subtype:',
                        [
                            { value: 'not-specified', label: 'Not specified' },
                            { value: 'lumA', label: 'Luminal A' },
                            { value: 'lumB', label: 'Luminal B' },
                            { value: 'her2', label: 'HER2-enriched' },
                            { value: 'tn', label: 'Triple Negative' },
                        ],
                        this.state.subtype,
                        this.onSubtypeChange.bind(this)
                    )}
                    {this.renderSelect(
                        'Location:',
                        [
                            { value: 'not-specified', label: 'Not specified' },
                            { value: 'left', label: 'Left' },
                            { value: 'right', label: 'Right' },
                        ],
                        this.state.location,
                        this.onLocationChange.bind(this)
                    )}
                    {this.renderSelect(
                        'Grade:',
                        [
                            { value: 'not-specified', label: 'Not specified' },
                            { value: 'low', label: 'Low' },
                            { value: 'low-medium', label: 'Low-medium' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'medium-high', label: 'Medium-high' },
                            { value: 'high', label: 'High' },
                        ],
                        this.state.grade,
                        this.onGardeChange.bind(this)
                    )}
                    {this.renderSelect(
                        'Residual Carcinoma:',
                        [
                            { value: 'not-specified', label: 'Not specified' },
                            { value: 'presence', label: 'Presence' },
                            { value: 'absence', label: 'Absence' },
                        ],
                        this.state.residualCarcinoma,
                        this.onResidualCarcinomaChange.bind(this)
                    )}
                    {this.renderSelect(
                        'Invasive Carcinoma:',
                        [
                            { value: 'not-specified', label: 'Not specified' },
                            { value: 'presence', label: 'Presence' },
                            { value: 'absence', label: 'Absence' },
                        ],
                        this.state.invasiveCarcinoma,
                        this.onInvasiveCarcinomaChange.bind(this)
                    )}
                    {this.renderSelect(
                        'Chronic Inflammation:',
                        [
                            { value: 'not-specified', label: 'Not specified' },
                            { value: 'presence', label: 'Presence' },
                            { value: 'absence', label: 'Absence' },
                        ],
                        this.state.chronicInflammation,
                        this.onChronicInflammationChange.bind(this)
                    )}
                    {this.renderTextInput(
                        'Trusted Code:',
                        this.state.trustedCode,
                        this.onTrustedCodeChange.bind(this)
                    )}
                    <Button 
                        style={styles.buttonStyle}
                        type="submit"
                        disabled={!this.state.canSubmit}
                    >
                        SUBMIT
                    </Button>
                </div>
            </form>
        )
    }

    onSaveBox(bbox) {
        this.bboxes.push(bbox)
        if (this.state.cropId < this.images.length - 1) {
            this.setState({ cropId: this.state.cropId + 1 });
        } else {
            this.setState({ showCrop: false, canSubmit: true, cropId: this.state.cropId + 1 })
        }
    }

    renderCrop() {
        if (this.state.showCrop) {
            return (
                <div style={styles.cropContainerStyle}>
                    <h1 style={styles.boxTextStyle}>{`Please select the bounding box of the ultrasound (${this.state.cropId + 1}/${this.images.length}).`}</h1>
                    <CropImage
                        src={this.images[this.state.cropId]}
                        onSaveBox={this.onSaveBox.bind(this)}
                    />
                </div>
            )
        }
    }

    render() {
        return (
            <div style={styles.containerStyle}>
                <Navbar current='Upload' />
                <h1 style={styles.titleStyle}>Upload Ultrasound Images</h1>
                <p style={styles.descriptionStyle}>
                Upload additional breast lesion ultrasound images (sonograms) available to you, and any information such as patient age, or the corresponding pathology or diagnosis report. <br />
Additional images uploaded here will help us grow our ground-truth dataset and fuel our future research efforts with the aim to improve the accuracy of our diagnosis tools.
                </p>
                {this.renderForm()}
            </div>
        );
    }
}

const styles = {
    containerStyle: {
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    cropContainerStyle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    boxTextStyle: {
        color: Colors.DarkGray,
        fontFamily: 'Verdana',
        margin: 20,
        fontSize: 25
    },
    selectStyle: {
        color: Colors.DarkGray,
        fontFamily: 'Verdana',
        margin: 20,
        fontSize: 25
    },
    titleStyle: {
        color: Colors.Red,
        fontFamily: 'Verdana',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 60
    },
    descriptionStyle: {
        color: Colors.DarkGray,
        fontFamily: 'Verdana',
        textAlign: 'justify',
        fontSize: 25,
        marginLeft: '5vw',
        marginRight: '5vw',
        maxWidth: '100%',
    },
    formStyle: {
        marginTop: 15,
    },
    inputStyle: {
        padding: 6,
        border: 5,
        borderRadius: 5,
        backgroundColor: Colors.DarkGray,
        display: 'inline-flex',
        cursor: 'pointer',
        paddingLeft: 25,
        paddingRight: 25,
        marginBottom: 10,
    },
    inputTextStyle: {
        fontFamily: 'Verdana',
        margin: 5,
        color: 'white',
        fontSize: 25,
    },
    pStyle: {
        color: Colors.DarkGray,
        fontFamily: 'Verdana',
        margin: 5,
        fontSize: 25
    },
    buttonStyle: {
        marginTop: 25,
    },
    predictionText: {
        color: Colors.DarkGray,
        fontFamily: 'Verdana',
        margin: 5,
        marginTop: 40,
        marginBottom: 50,
        fontSize: 30
    },
    filenameStyle: { 
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkIconStyle: {
        height: 35,
        width: 35,
        color: 'green'
    }
}

export default Upload;
