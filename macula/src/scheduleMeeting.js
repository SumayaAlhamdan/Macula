import React, { Fragment, useEffect } from "react";
import { ZoomMtg } from '@zoomus/websdk';

const Meeting = ({ payload }) => {
    useEffect(() => {
        const loadZoomSDK = async () => {
            try {
                ZoomMtg.setZoomJSLib('https://source.zoom.us/lib', '/av');
                ZoomMtg.preLoadWasm();
                ZoomMtg.prepareWebSDK();

                const signature = await ZoomMtg.generateSignature({
                    meetingNumber: '76704827793',
                    sdkKey: process.env.SDK_KEY,
                    sdkSecret: process.env.SDK_SECRET,
                    role: 0,
                    success: function (res) {
                        console.log('Signature generated successfully:', res.result);
                    }
                });

                ZoomMtg.init({
                    leaveUrl: "https://localhost:3000",
                    success: function (data) {
                        ZoomMtg.join({
                            meetingNumber: '76704827793',
                            signature: signature,
                            sdkKey: process.env.SDK_KEY,
                            userName: '',
                            userEmail: '',
                            passWord: '',
                            success: function () {
                                console.log('--Joined--');
                            },
                            error: function (error) {
                                console.log(error);
                            }
                        })
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            } catch (error) {
                console.error('Error loading Zoom SDK:', error);
            }
        };

        loadZoomSDK();
    }, [payload]);

    return <Fragment></Fragment>;
};

export default Meeting;
