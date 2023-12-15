import styles from '../styles/dashboard.module.css';

const UsageGraph = async () => {
    // try {
    //     const carbonData = await fetch('/api/carbon-data', {
    //         method: 'GET',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //     })

    //     const json = await carbonData.json();
        
    //     // console.log('json??', json);
    // } catch (err) {
    //     console.log('Database error', err)
    // }


    // const energyData = await fetch('/api/energy-data', {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     }
    // });

    // console.log('energyData', energyData);
    return (
        <div className={`${styles.container} mt-3`}>
            <h2 className='text-lg text-green-700'>Usage Graph:</h2>
            <p>Graph goes here</p>
        </div>
    )
}

export default UsageGraph;