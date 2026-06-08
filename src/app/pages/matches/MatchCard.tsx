import { FC, useState } from "react";
import { KTIcon } from "../../../_metronic/helpers";
import { IMatch } from "./match.tsx";
import "../../../_metronic/assets/sass/layout/matchCardStyle.css";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import { ThirtyTwoText } from "../../common/design/typography/32Text.tsx";
import moment from 'moment';
import { MultipleDeleteModal } from "../../../_metronic/partials/widgets/modal/MultipleDeleteModal.tsx";

 
type Props = {
  match: IMatch;
  button1?: () => void | null;
  button2?: () => Promise<void> | null;
  b1Icon?: string;
  b2Icon?: string;
};

const MatchCard: FC<Props> = ({
  match,
  button1 = null,
  button2 = null,
  b1Icon = "pencil",
  b2Icon = "trash",
}) => {
  return (

    <div className="card h-100">

      <div
        className="card-body d-flex justify-content-center text-center flex-column p-8 pb-4 pt-4 "
        style={{
          width: '100%',
          background: `linear-gradient(to bottom right,
                ${match.team1?.teamThemeColor} 25%,
                white 25%,
                white 75%,
                ${match.team2?.teamThemeColor} 75%)`
          ,
          border:'1px solid grey',
          borderRadius: "15px",
          height: "350px",
        }}
       >
        <a
          href="#"
          className="text-gray-800 d-flex flex-column"
          style={{ color: 'transparent'}}
        >
          <div className="match-container">
            
            <div className= "col-md-3 col-xl-3 col-sm-3">
              <div className="fs-5 fw-bolder mb-2">
                {match.team1?.teamState === match.venueState ? "Home" : "Away"}
              </div>
              <div className="symbol symbol-60px mb-6">
                <img src={match.team1?.teamLogo} alt="" />
              </div>
              <div className="fs-4 fw-bolder mb-2 ml-2 mr-2" style={{ margin: '0 -20%'}}>
                {match.team1?.teamName}
              </div>
            </div>

            <div className= "col-md-3 col-xl-3 col-sm-3">

              {/* <ThirtyTwoText>
                {match.matchResult ? 
                  <>{match.matchResult?.score?.team1Score} : {match.matchResult?.score?.team2Score}</>
                  : <>{0}:{0}</>
                }
              </ThirtyTwoText> */}

              <div style={{fontFamily: "Clash Display", fontWeight: '600', fontSize: "25px", textAlign: "center", color: "black", display: 'flex',justifyContent: 'center',paddingTop: "40px",}}>
                {match.matchResult ? 
                  <>
                    <div className= "">
                      {match.matchResult?.score?.team1Score}
                    </div>
                    <div className= "col-md-4 col-xl-4 col-sm-4"> : </div>
                    
                    <div className= "">
                      {match.matchResult?.score?.team2Score}
                    </div>
                  </>
                  : <>{0}:{0}</>
                }
              </div>
            </div>
            <div className= "col-md-3 col-xl-3 col-sm-3">
              <div className="fs-5 fw-bolder mb-2">
                {match.team2?.teamState === match.venueState ? "Home" : "Away"}
              </div>
              <div className="symbol symbol-60px mb-6 pe-2">
                <img src={match.team2?.teamLogo} alt="" />
              </div>
              <div className="fs-5 fw-bolder mb-2 ml-2 mr-2" style={{ margin: '0 -20%'}}>
                {match.team2?.teamName}
              </div>
            </div>
          </div>
        </a>
          <div className='bg-black rounded-3 py-2 bg-opacity-50 mb-1'>
            <div className="fs-7 fw-bold text-white  mt-auto">
              {match.venueState}
            </div>
            <div className="fs-7 fw-bold text-white mt-auto">
              {match.footballLeague} | {match.matchRound}
            </div>
            {/* <div className="fs-7 fw-bold text-white  mt-auto">
              {match.matchRound}
            </div> */}
            <div className="fs-7 fw-bold text-white  mt-auto">
              {moment(match.matchDate).format('Do MMM YY h:mm A')}
            </div>
          </div>
        <div className="d-flex justify-content-evenly mt-2 mb-4">
          {button1 && (
            <a onClick={button1} className="btn btn-bg-light btn-color-primary" style={{backgroundColor:'#eeeeee'}}>
              <KTIcon iconName={b1Icon} className="fs-2 text-primary" />
            </a>
          )}
          {button2 && (
            <a onClick={button2} className="btn btn-bg-light btn-color-danger" style={{backgroundColor:'#eeeeee'}}>
              <KTIcon iconName={b2Icon} className="fs-2 text-danger" />
            </a>
          )}
        </div>
      </div>
    </div>


  );
};

export { MatchCard };
