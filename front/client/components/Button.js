import React, { Component } from 'react';
import Colors from '../Colors';
import Loader from 'react-loader-spinner'

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

class Button extends Component {
    
    renderContent() {
        if (this.props.load) {
            return (
                <Loader
                    type="ThreeDots"
                    color="white"
                    height={30}
                    width={80}
                    style={{ position: 'absolute', width: '50%', left: '25%', right: '25%', }}
                />
            )
        }
    }

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
                <div style={{ opacity: this.props.load ? 0 : 1 }}>
                    {this.props.children}
                </div>
                {this.renderContent()}
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
        position: 'relative'
    },
}

export default Button;