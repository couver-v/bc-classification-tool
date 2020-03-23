import React, { Component } from 'react';
import Colors from '../Colors';
import {  } from 'react-router-dom'

class Footer extends Component {
    
    render() {
        return (
            <div style={styles.containerStyle}>
                <p style={styles.textStyle}>DeepBC - Knowledge Engineering Group (KEG) - Tsinghua University</p>
            </div>
        );
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: Colors.DarkGray,
        padding: 10,
    },
    linkStyle: {
        padding: 20,
        marginHorizontal: 20,
        textDecoration: 'none'
    },
    textStyle: {
        color: Colors.White,
        fontFamily: 'Verdana',
        fontSize: 20,
        margin: 10,
    }
}

export default Footer;
