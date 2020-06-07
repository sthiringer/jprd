import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <div className="container-about">
                <p>Copyright © 2020 Stephen Thiringer</p>
                <p>Questions, related data, and below notice gathered from <a href="http://www.j-archive.com/">J! Archive</a>.</p>
                <p>
                The Jeopardy! game show and all elements thereof, including but not limited to copyright and trademark thereto, 
                are the property of Jeopardy Productions, Inc. and are protected under law. 
                This website is not affiliated with, sponsored by, or operated by Jeopardy Productions, Inc.
                </p>
            </div>
        );
    }
}

export default Footer;