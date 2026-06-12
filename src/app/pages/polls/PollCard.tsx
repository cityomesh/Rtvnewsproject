import { useNavigate } from "react-router-dom";
import { KTIcon } from "../../../_metronic/helpers";
import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
import { useEffect, useMemo, useState } from "react";
import { useThemeMode } from "../../../_metronic/partials/layout/theme-mode/ThemeModeProvider";
import { Typography } from "@mui/material";
import { isAdmin } from "../../modules/auth/session.ts";

interface PollCardProps {
  poll: any;
  deletePoll: (id: string) => Promise<void>;
  showEdit?: boolean;   // edit permission (creator or admin)
}

const PollCard: React.FC<PollCardProps> = ({ poll, deletePoll, showEdit = true }) => {
  const navigate = useNavigate();
  const id = poll.id;
  const [openModal, setOpenModal] = useState(false);
  const themeMode = useThemeMode();
  const adminUser = isAdmin();   // ✅ true if admin

  const [systemMode, setSystemMode] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemMode(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setSystemMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isDark = useMemo(() => {
    if (themeMode.mode === "dark") return false;
    if (themeMode.mode === "light") return false;
    return systemMode === true;
  }, [themeMode.mode, systemMode]);

  if (themeMode.mode === "system" && systemMode === null) {
    return null;
  }

  const toggleModal = () => setOpenModal(!openModal);

  return (
    <>
      {openModal && (
        <Modal
          header="Delete Poll?"
          isOpen={openModal}
          toggleDialog={toggleModal}
          action2={{ event: toggleModal, label: "Cancel" }}
          action1={{
            event: async () => {
              await deletePoll(id);
              toggleModal();
            },
            label: "Delete",
          }}
          title="Poll"
        />
      )}

      <div
        style={{
          borderRadius: "16px",
          padding: "20px",
          paddingBottom: "16px",
          backgroundColor: isDark ? "#1b1c22" : "#ffffff",
          color: isDark ? "#ffffff" : "#000000",
          boxShadow: isDark
            ? "0 0 8px rgba(255, 255, 255, 0.05)"
            : "0 0 8px rgba(0, 0, 0, 0.05)",
        }}
        className="d-flex flex-column justify-content-between"
      >
        <div className="d-flex flex-column justify-content-around" style={{ fontSize: "16px" }}>
          <p>{poll.question.title}</p>
          <div className="card-content mt-4">
            {poll.question.options.map((e: any, idx: number) => (
              <PollLabel
                key={idx}
                label={e.label}
                percent={e.optionPercentage}
                totalResponses={poll.responseStats.responseCount}
                isDark={isDark}
              />
            ))}
          </div>
        </div>

        <div className="d-flex flex-column">
          <div className="mb-2">
            { poll.responseStats.responseCount > 0 && (<p
                className=""
                style={{ color: "#6c757d", fontWeight: 500 }}
              >
                Total Participants: {poll.responseStats.responseCount}
              </p>
            )}
            {poll.expiryDate && (
              <div>
                Expiry Date: {new Date(poll.expiryDate).toDateString()}
              </div>
            )}
          </div>
          <div className="d-flex justify-content-center">
            {/* Edit button – shown only if user has edit permission */}
            {showEdit && (
              <a
                onClick={() => navigate(`/poll/create/${id}`)}
                className="btn btn-bg-light btn-color-danger p-1 btn-icon btn-outline me-6"
              >
                <KTIcon iconName="pencil" className="fs-2 text-primary" />
              </a>
            )}
            {/* Delete button – shown only for admin users */}
            {adminUser && (
              <a
                onClick={toggleModal}
                className="btn btn-bg-light btn-color-danger p-1 btn-icon btn-outline"
              >
                <KTIcon iconName="trash" className="fs-2 text-danger" />
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

interface PollLabelProps {
  label: string;
  percent: number;
  isDark: boolean;
  totalResponses: number;
}

const PollLabel: React.FC<PollLabelProps> = ({ label, percent, isDark, totalResponses }) => {
  const trackBg = isDark ? "#2e2e2e" : "#f1f1f1";
  const textColor = isDark ? "#ffffff" : "#000000";

  const fillGradient = isDark
    ? "linear-gradient(to right, #6a1b9a, #8e24aa)"
    : "linear-gradient(to right, #42a5f5, #1e88e5)";
  
  const votes = Math.round((percent / 100) * totalResponses);

  return (
    <div style={{ margin: "16px 0px" }}>
      <div
        style={{
          backgroundColor: trackBg,
          borderRadius: "60px",
          width: "100%",
          height: "36px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            background: fillGradient,
            width: `${percent}%`,
            height: "100%",
            borderRadius: "60px 0 0 60px",
            transition: "width 0.3s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "13px",
            color: textColor,
          }}
        >
          <Typography>{label}</Typography>
          <div>{percent}% / {votes}</div>
        </div>
      </div>
    </div>
  );
};

export default PollCard;
