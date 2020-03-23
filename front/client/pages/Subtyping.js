import React, { Component } from 'react';
import Colors from '../Colors';
import Histogram from '../components/Histogram';
import CropImage from '../components/CropImage';
import Button from '../components/Button';
import { FiCheck } from 'react-icons/fi';
var d3 = require("d3");
class Subtyping extends Component {

    constructor(props) {
        super(props);
        this.state = { filenames: [], showResult: false, showCrop: false, canSubmit: false, cropId: 0 }
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
        event.preventDefault();
        // alert(
        //     `Selected file - ${this.fileInput.current.files[0].name}`
        // );
        const data = [
            { label: 'lumA', probability: 0.25 },
            { label: 'lumB', probability: 0.35 },
            { label: 'HER', probability: 0.25 },
            { label: 'TN', probability: 0.15 },
        ]
        this.setState({ data, showResult: true, canSubmit: false })
    }

    onChange(event) {
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

    renderPrediction() {
        if (this.state.showResult) {
            let percentage = d3.format(".0%")
            var maxProb = 0
            var subtype = ''
            for (let i = 0; i < this.state.data.length; i++) {
                if (this.state.data[i].probability > maxProb) {
                    maxProb = this.state.data[i].probability
                    subtype = this.state.data[i].label
                };
            }
            return (
                <p style={styles.predictionText}>DeepBC predicts this breast cancer is a <strong>{subtype}</strong> with <strong>{percentage(maxProb)}</strong> confidence.</p>
            )
        }
    }

    renderHisogram() {
        if (this.state.showResult) {
            return (
                <Histogram
                    width={600}
                    height={500}
                    data={this.state.data}
                    barWidth={600 / this.state.data.length * 0.7}
                />
            )
        }
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
                            onChange={this.onChange.bind(this)}
                        />
                    </label>
                    <br />
                    {this.renderFilenames()}
                    {this.renderCrop()}
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
                    <h1 style={styles.selectStyle}>{`Please select the bounding box of the ultrasound (${this.state.cropId + 1}/${this.images.length}).`}</h1>
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
                <h1 style={styles.titleStyle}>Breast Cancer Subtyping</h1>
                <p style={styles.descriptionStyle}>
                    This tool can predict the hisological molecular subtype of a breast cancer.<br/>
                    It also provide the probability distribution.

                    To get the results you need to upload 1 or more ultrasound images of your cancer the to follow the few steps.
                </p>
                {this.renderForm()}
                {this.renderPrediction()}
                {this.renderHisogram()}
            </div>
        );
    }
}

const styles = {
    containerStyle: {
        backgroundColor: 'white',
        height: '100%',
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
    selectStyle: {
        color: Colors.DarkGray,
        fontFamily: 'Verdana',
        margin: 20,
        fontSize: 25
    },
    titleStyle: {
        color: Colors.Red,
        fontFamily: 'Verdana',
        marginTop: 50,
        fontSize: 60
    },
    descriptionStyle: {
        color: Colors.DarkGray,
        fontFamily: 'Verdana',
        fontSize: 25,
        margin: 25
    },
    formStyle: {
        // alignSelf: 'flex-start',
        marginTop: 15,
        // width: '100%'
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

export default Subtyping;
