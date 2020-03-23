import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import Colors from '../Colors';
import {  } from 'react-router-dom'

class Navbar extends Component {
    
    render() {
        return (
            <nav>
                <div style={styles.containerStyle}>
                    <NavLink style={styles.linkStyle} to="/"><p style={styles.textStyle}>Home</p></NavLink>
                    <NavLink style={styles.linkStyle} to="/malignancy"><p style={styles.textStyle}>Malignancy</p></NavLink>
                    <NavLink style={styles.linkStyle} to="/subtyping"><p style={styles.textStyle}>Subtyping</p></NavLink>
                    <NavLink style={styles.linkStyle} to="/upload"><p style={styles.textStyle}>Upload</p></NavLink>
                </div>
            </nav>
        );
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: Colors.Red,
    },
    linkStyle: {
        padding: 20,
        marginHorizontal: 20,
        textDecoration: 'none'
    },
    textStyle: {
        color: Colors.White,
        fontFamily: 'Verdana',
        fontSize: 25,
        margin: 5,
    }
}

export default Navbar;
