const llms = require ("langchain/llms");

require("dotenv").config;

const run = async () => {

    //Instantiante the OpenAI model 
    //Pass the "temperature" parameter which controls the RANDOMNESS of the model's output. A lower temperature will result in more predictable output, while a higher temperature will result in more random output. The temperature parameter is set between 0 and 1, with 0 being the most predictable and 1 being the most random
    const model = new llms.OpenAI({ temperature: 0.9 });

    //Calls out to the model's (OpenAI's) endpoint passing the prompt. This call returns a string
    const res = await model.call(
        "What would be a good company name a company that makes colorful socks?"
    );
    console.log({ res });
};

run();

