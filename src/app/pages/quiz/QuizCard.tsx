import { FC } from "react";
import { KTIcon } from "../../../_metronic/helpers";
import { IQuiz } from "./quiz.tsx";
import moment from "moment";

type Props = {
  quiz: IQuiz;
  button1?: () => void | null;
  button2?: () => Promise<void> | null;
  b1Icon?: string;
  b2Icon?: string;
  id: string;
  activeId: string;
  setActiveId: any;
};

const QuizCard: FC<Props> = ({
  quiz,
  button1 = null,
  button2 = null,
  b1Icon = "pencil",
  b2Icon = "trash",
}) => {
  return (
    <div className="card h-100">
      <div className="card-body d-flex justify-content-center text-center flex-column p-8">
        <div className="text-gray-800 d-flex flex-column">
          <div className="match-container">
            <div className="row">
              <div
                className="col-lg-8 col-md-8 fs-5 fw-bold row"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  textAlign: "left",
                }}
              >
                {Array.isArray(quiz?.questions) && quiz.questions.length > 0 ? (
                  <>
                    <div className="col-lg-12">{quiz.questions[0].question}</div>
                    <div className="col-lg-12 mb-2">
                      <span
                        className="fw-normal"
                        style={{ color: "grey", fontWeight: "normal" }}
                      >
                        No. of questions -
                      </span>{" "}
                      {quiz.questions.length}
                    </div>
                    <div className="col-lg-12 mb-2">
                        <span className="fw-normal text-gray-600">
                        No. of Responses -
                        </span>{" "}
                      {quiz.responseCount}
                    </div>

                    <div className="col-lg-12">
                        <span
                          className="fw-normal"
                          style={{ color: "grey", fontWeight: "normal" }}
                        >
                          {moment(quiz.updatedAt).format('Do MMM YY h:mm A')}
                        </span>{" "}
                    </div>
                  </>
                ) : (
                  <div className="col-lg-12 text-muted">No questions available</div>
                )}
              </div>

              <div className="col-lg-4 col-md-4 d-flex justify-content-end align-items-start gap-2">
                {button1 && (
                  <a
                    onClick={button1}
                    className="btn btn-bg-light btn-color-primary"
                    title="Edit"
                  >
                    <KTIcon iconName={b1Icon} className="fs-2 text-primary" />
                  </a>
                )}
                {button2 && (
                  <a
                    onClick={button2}
                    className="btn btn-bg-light btn-color-danger"
                    title="Delete"
                  >
                    <KTIcon iconName={b2Icon} className="fs-2 text-danger" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { QuizCard };
