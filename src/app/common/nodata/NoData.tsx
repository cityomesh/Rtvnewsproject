import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NoDataProps {
    title: string,
    createUrl: string
}

const NoData:React.FC<NoDataProps> = ({title ,createUrl}) => {

    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(createUrl);
    };

    const mystyle = {
        // color: "white",
        width: '100%',
        height: '500px'
    };

    return (
        
    <div className='data-container bg-gray-300' style={mystyle}>
        <div className='' style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center'}}>
            <h2>There is No {title} Available</h2>

            {/* <button className='p-3 px-6 btn btn-primary' style={{ color: '#fff', border: 'none', borderRadius: '6px'}} onClick={handleRedirect}>
                Create {title}
            </button> */}
        </div>
    </div>
    
    )
}

export default NoData;