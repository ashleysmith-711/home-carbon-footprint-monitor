import styles from '../styles/dashboard.module.css';

const UserInfo = () => {
    return (
        <div className={styles.container}>
            <h2 className='text-lg text-green-700'>My Info</h2>
            <div className={`flex`}>
            <img
                className="inline-block h-20 w-20 rounded-full ring-2 ring-white mr-3"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
                />
                <div>
                    <p>Ashley Smith</p>
                    <p>6100 Huntingdale Cir, Lodi, CA 95219</p>
                    <p>Utility Provider: PG&E</p>
                </div>
            </div>
            
        </div>
    )

}

export default UserInfo;