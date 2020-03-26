import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Colors from '../Colors';
import {  } from 'react-router-dom'

class Navbar extends Component {

    constructor(props) {
        super(props)
        this.routes = [
            { title: 'DeepBC', url: '/' },
            { title: 'Malipred', url: '/malignancy' },
            { title: 'Subtyper', url: '/subtyping' },
            { title: 'Upload', url: '/upload' },
        ] 
    }
    
    render() {
        return (
            <nav style={{ width: '100%' }}>
                <div style={styles.containerStyle}>
                    {
                        this.routes.map((route) => {
                            return (
                            <NavLink 
                                style={{ 
                                    ...styles.linkStyle,
                                    backgroundColor: route.title == this.props.current ? Colors.DarkRed : Colors.Red
                                }}
                                to={route.url}
                                key={route.url}
                            >
                                <p style={styles.textStyle}>{route.title}</p>
                            </NavLink>
                        )})
                    }
                    {/* // <NavLink style={styles.linkStyle} to='/'><p style={styles.textStyle}>DeepBC</p></NavLink>
                    // <NavLink style={styles.linkStyle} to='/malignancy'><p style={styles.textStyle}>Malipred</p></NavLink>
                    // <NavLink style={styles.linkStyle} to='/subtyping'><p style={styles.textStyle}>Subtyping</p></NavLink>
                    // <NavLink style={styles.linkStyle} to='/upload'><p style={styles.textStyle}>Upload</p></NavLink> */}
                </div>
            </nav>
        );
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: Colors.Red,
        width: '100%'
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
