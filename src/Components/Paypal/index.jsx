import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function Paypal({ onSuccess, informationPayment }) {
    const paypal = useRef();
    console.log(informationPayment);
    const valueTotal = parseFloat((informationPayment.giaTien * 1.1) / 23000).toFixed(2)
    const value = parseFloat((informationPayment.giaTien) / 23000).toFixed(2)


    useEffect(() => {
        window.paypal
            .Buttons({
                createOrder: (data, actions, error) => {
                    return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [
                            {
                                description: 'Course',
                                amount: {
                                    value: valueTotal,
                                    // value: 10,
                                    currency_code: 'USD',
                                    breakdown: {
                                        item_total: {
                                            currency_code: 'USD',
                                            value: valueTotal,
                                            // value: 10,
                                        },
                                    },
                                },
                                items:
                                    [
                                        {
                                            unit_amount: {
                                                currency_code: 'USD',
                                                value: valueTotal,
                                                // value: 10,
                                            },
                                            quantity: '1',
                                            name: informationPayment.tenKhoaHoc + ' Course',
                                            // name: '1',
                                        }
                                    ],


                            },
                        ],
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    if (onSuccess) {
                        await onSuccess(true);
                    }
                    console.log('successful order' + order);
                },
                onError: (err) => {
                    console.log(err);
                },
            })
            .render(paypal.current);
    }, []);

    return <div ref={paypal}></div>;
}

export default Paypal;