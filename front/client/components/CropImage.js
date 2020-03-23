import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Colors from '../Colors';
import Button from '../components/Button';

class CropImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            crop: {
                unit: '%',
                width: 30,
            },
        };
    }

    onImageLoaded(image) {
        this.imageRef = image;
    };

    onCropChange(crop, percentCrop) {
        this.setState({ crop });
    };

    onSaveBox() {
        if (this.props.onSaveBox) {
            this.props.onSaveBox(this.state.crop)
            this.setState({
                crop: {
                    unit: '%',
                    width: 30,
                },
            });
        }
    }

    isButtonDisable() {
        return !(this.state.crop.width && this.state.crop.width > 100
            && this.state.crop.height && this.state.crop.height > 100)
    }

    render() {
        const { crop } = this.state;
        return (
            <div style={styles.containerStyle}>
                {this.props.src && (
                    <ReactCrop
                        src={this.props.src}
                        crop={crop}
                        ruleOfThirds
                        onImageLoaded={this.onImageLoaded.bind(this)}
                        onChange={this.onCropChange.bind(this)}
                    />
                )}
                <Button
                    onClick={this.onSaveBox.bind(this)}
                    style={styles.buttonStyle}
                    disabled={this.isButtonDisable()}
                >
                    DONE
                </Button>
            </div>
        );
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    buttonStyle: {
        alignSelf: 'flex-end',
        marginTop: 25,
    },
}

export default CropImage;


