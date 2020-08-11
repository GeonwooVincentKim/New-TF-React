import React, {useState} from 'react';
import update from 'immutability-helper';
import * as tf from '@tensorflow/tfjs';

import './TensorflowExample.css';

const TensorflowExample = () => {
    // Value pairs state
    const [valuePairsState, setValuePairsState] = useState([
        {x: -1, y: -3},
        {x: 0., y: -1},
        {x: 1, y: 1},
        {x: 2, y: 3},
        {x: 3, y: 5},
        {x: 4, y: 7},
    ]);

    // Define the Model-State.
    const [modelState, setModelState] = useState({
        model: null,
        trained: false,
        predictedValue: "Click on train!",
        valueToPredict: 1,
    });

    // Event Handlers
    const HandleValuePairChange = (e) =>{
        const updatedValuePairs = update(valuePairsState, {
            [e.target.dataset.index]: {
                [e.target.name]: { $set: parseInt(e.target.value)}
            }
        });

        setValuePairsState(
            updatedValuePairs
        );
    };

    // Adding Image or other substance Items to handleAddItem.
    const handleAddItem = () => {
        setValuePairsState([
            ...valuePairsState,
            {x : 1, y: 1}
        ]);
    };
    
    // Change Model-Index by handling Model-Colums-Index that belongs to Model.
    const handleModelChange = (e) => setModelState({
        ...modelState,
        [e.target.name]: [parseInt(e.target.value)],
    });

    // Add the rest of the code from the 'Tensorflow.js' site.
    const handleTrainModel = () => {
        let xValues = [],
            yValues = [];

        valuePairsState.forEach((val, index) => {
            xValues.push(val.x);
            yValues.push(val.y);
        });
        
        // Define a model for Linear-Regression.
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: [1]}));

        // Prepare the model for training: 
        // --> Specity the loss and the optimizer.
        model.compile({ loss: 'meanSquaredError', optimizer: 'sgd'});
        const xs = tf.tensor2d(xValues, [xValues.length, 1]);
        const ys = tf.tensor2d(yValues, [yValues.length, 1]);

        // Train the Model using the data.
        model.fit(xs, ys, { epochs: 250}).then(() => {
            setModelState({
                ...modelState,
                model: model,
                trained: true,
                predictedValue: 'Ready for making predictions',
            });
        });
    }

    const handlePredict = () =>{
        // Use the model to do inference on a data point the model hasn't seen before:
        const predictedValue = modelState.model.predict(tf.tensor2d([modelState.valueToPredict], [1, 1])).arraySync()[0][0];

        setModelState({
            ...modelState,
            predictedValue: predictedValue,
        });
    }


    return (
        <div className="tensorflow-example">
            <div className="train-controls">
                <h2 className="section">Training Data (x, y) pairs</h2>
                <div className="row labels">
                    <div className="field-label column">X</div>
                    <div className="field-label column">Y</div>
                </div>
                {/* Rendering a field input and output. */}
                {valuePairsState.map((val, index) => {
                    return (
                        <div key={index} className="row">
                            {/* This is input. */}
                            <input
                                className="field field-x column"
                                value={val.x}
                                name="x"
                                data-index={index}
                                onChange={HandleValuePairChange}
                                type="number" pattern="[0-9]*"
                            />
                            {/* This is output. */}
                            <input
                                className="field field-y column"
                                value={val.y}
                                name="y"
                                data-index={index}
                                onChange={HandleValuePairChange}
                                type="number" pattern="[0-9]*"
                            />
                        </div>
                    );
                })};

                {/* Create button that adds new items. */}
                <button
                    className="button-add-example button --green"
                    onClick={handleAddItem}>
                    +
                </button>

                {/* Training the model are alreaddy connected to their respective handlers. */}
                <button
                    className="button-train-example button --green"
                    onClick={handleAddItem}>
                    Train
                </button>
                
                {/* 
                    Prediction Contols that I ceate an input field to allow the user to enter
                    a value so that its output can be predicted.
                 */}
                 <div className="predict-controls">
                     <h2 className="section">Predicting</h2>
                     <input
                        className="field element"
                        value={modelState.valueToPredict}
                        name="valueToPredict"
                        onChange={handleModelChange}
                        type="number"
                        placeholder="Enter an integer number"
                    /><br/>
                    <div className="element">
                        {modelState.predictedValue}
                    </div>
                    {/* 
                        A button to perform the actual predicction which will only be enabled 
                        once the model has been trained.
                    */}
                    <button
                        className="element button--green"
                        onClick={handlePredict}
                        disabled={!modelState.trained}>
                        Predict 
                    </button>
                 </div>
            </div>
        </div>
    );
}

export default TensorflowExample;