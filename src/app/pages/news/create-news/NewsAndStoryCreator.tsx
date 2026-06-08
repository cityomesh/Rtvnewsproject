import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NewsFormDetails } from './NewsFormDetails';
import StoryCardsForm from './StoryCardsForm';

const NewsAndStoryCreator: React.FC = () => {
   const location = useLocation(); // Get the route state
    
   const [activeForm, setActiveForm] = useState<'news' | 'story'>(
        location.state?.isStory ? 'story' : 'news'
    );
    return (
        <div className="card">
            <div className="card-header border-0 pt-5">
                <div className="card-toolbar">
                    <ul className="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0">
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeForm === 'news' ? 'active' : ''}`}
                                onClick={() => setActiveForm('news')}
                                style={{ cursor: 'pointer' }}
                            >
                                Create News Article
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeForm === 'story' ? 'active' : ''}`}
                                onClick={() => setActiveForm('story')}
                                style={{ cursor: 'pointer' }}
                            >
                                Create Story
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="card-body">
                {activeForm === 'news' && <NewsFormDetails />}
                {activeForm === 'story' && <StoryCardsForm />}
            </div>
        </div>
    );
};

export default NewsAndStoryCreator;
