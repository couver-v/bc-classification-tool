import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import Colors from '../Colors';

class Button extends Component {
    
    render() {
        return (
            <button 
                style={{ 
                    opacity: this.props.disabled ? 0.5 : 1,
                    cursor: this.props.disabled ? 'auto' : 'pointer',
                    ...styles.buttonStyle,
                    ...this.props.style
                }}
                type={this.props.type}
                disabled={this.props.disabled}
                onClick={this.props.onClick}
            >
                {this.props.children}
            </button>
        )
    }
}

const styles = {
    buttonStyle: {
        borderRadius: 5,
        backgroundColor: Colors.DarkGray,
        color: 'white',
        display: 'flex',
        fontSize: 25,
        padding: 10,
        fontFamily: 'Verdana',
        paddingLeft: 25,
        paddingRight: 25,
    },
}

export default Button;