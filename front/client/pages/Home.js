import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import Button from '../components/Button';
import Colors from '../Colors';
import Malignancy from './Malignancy';
import Navbar from '../components/Navbar';


class Home extends Component {

    renderSection(title, description, path) {
        return (
            <div style={styles.linkContainerStyle}>
                <NavLink style={styles.linkStyle} to={path}>
                    <h1 style={styles.sectionTitleStyle}>{title}</h1>
                    <p style={{ ...styles.descriptionStyle, color: Colors.DarkGray, margin: 0, textAlign: 'left' }}>
                        {description}
                    </p>
                </NavLink>
            </div>
        )
    }

    render() {
        return (
            <div style={styles.containerStyle}>
                <Navbar current='DeepBC'/>
                <h1 style={styles.titleStyle}>DeepBC</h1>
                <h1 style={styles.subtitleStyle}>Research Project at Tsinghua University</h1>
                <p style={styles.descriptionStyle}>
                Breast cancer is the most common cancer and the second leading cause of cancer mortality in women worldwide. Meanwhile, it has a high cure rate when detected early and treated according to best practices.
                However, the treatment drastically changes depending on the breast cancer molecular subtype: luminal A, luminal B, HER-2 enriched and triple-negative.
                <br />
                We present here a toolkit to predict the malignancy of a tumour and to subtype it based on ultrasound images.
                </p>
                <div style={styles.sectionsContainer}>
                    {this.renderSection(
                        'Malipred',
                        'Predict whether a Breast Cancer is Malignant or Benign.',
                        '/malignancy'
                    )}
                    {this.renderSection(
                        'Subtyping',
                        'Predict the molecular subtype of a Breast Cancer (Luminal A, Luminal B, HER2-enriched and Triple Negative)',
                        '/subtyping'
                    )}
                    {this.renderSection(
                        'Upload',
                        'Help us to grow our dataset by uploading labelled and unlabelled ultrasound images.',
                        '/upload'
                    )}
                </div>
            </div>
        );
    }
}

const styles = {
    containerStyle: {
        alignSelf: 'center',
        backgroundColor: Colors.White,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // maxWidth: '500',
        // marginRight: 'auto',
        // marginLeft: 'auto',
    },
    titleStyle: {
        color: Colors.Red,
        fontFamily: 'Verdana',
        marginTop: 50,
        marginBottom: 10,
        fontSize: 60
    },
    subtitleStyle: {
        color: Colors.DarkGray,
        fontFamily: 'Verdana',
        fontSize: 25,
        margin: 20,
        textAlign: 'center'
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
    linkContainerStyle: {
        alignSelf: 'center',
        backgroundColor: Colors.White,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: 3,
        borderColor: Colors.Red,
        borderStyle: 'solid',
        width: '100%',
        padding: 30,
        borderRadius: 10,
        margin: 30,
    },
    linkStyle: {
        backgroundColor: Colors.White,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        textDecoration: 'none',
        width: '90%'
    },
    sectionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        minWidth: '50%',
        maxWidth: '100%',
        width: 1000

    },
    sectionTitleStyle: {
        fontFamily: 'Verdana',
        color: Colors.Red,
        fontSize: 30,
        marginTop: 0
    }
}

export default Home;
