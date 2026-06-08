import React from 'react';
import './style.css';

// shimmer-card-container

const Shimmer:React.FC = () => {
    return (
        <div className='row g-6 g-xl-9 mb-6 mb-xl-9'>
            
                {Array(10).fill("").map((e, index) => (
                    <div className='col-12 col-sm-6 col-md-4 col-xl-4' >
                        <div key={index} className='shimmer-card'></div>

                    </div>
                ))}
            
        </div>
    )
}

export const ShimmerFullCard: React.FC = () => {
    return (
        <div className='shimmer-column-card-container'>
            {Array(10).fill("").map((e, index) => (<div key={index} className='shimmer-column-card'>
    
            </div>))}
        </div>
    )
}

export default Shimmer;