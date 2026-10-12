import { useIntl } from "react-intl";
import { AsideMenuItemWithSub } from "./AsideMenuItemWithSub";
import { AsideMenuItem } from "./AsideMenuItem";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../../../app/modules/auth/session";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { KTIcon } from "../../../helpers";

export function AsideMenuMain() {
  const intl = useIntl();
  const [toggle, setToggle] = useState<string>("");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';

  const handleLogoutClick = () => setLogoutDialogOpen(true);
  const handleLogoutCancel = () => setLogoutDialogOpen(false);
  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          fontSize: "16px",
          fontWeight: "500",
          height: "100%",
        }}
      >
        <Link to="/dashboard" style={{ width: "100%", textDecoration: "none" }}>
          <AsideMenuItemWithSub
            to="/dashboard"
            icon="black-right"
            iconExpanded="black-right"
            title={intl.formatMessage({ id: "MENU.DASHBOARD" })}
            fontIcon="bi-app-indicator"
            toggle={toggle}
            setToggle={setToggle}
            noSubs={true}
          />
        </Link>

        <AsideMenuItemWithSub
          icon="black-right"
          to="../pages/news/create"
          title="News"
          toggle={toggle}
          setToggle={setToggle}
        >
          <AsideMenuItem
            to="/news/create"
            title="Create News"
            hasBullet={true}
            setToggle={setToggle}
          />
          <AsideMenuItem
            to="/news"
            title="Latest News"
            hasBullet={true}
            setToggle={setToggle}
          />
          <AsideMenuItem
            to="/news/drafts"
            title="Drafts"
            hasBullet={true}
            setToggle={setToggle}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub
          icon="black-right"
          to="../pages/quiz/create"
          title="Quizes"
          toggle={toggle}
          setToggle={setToggle}
        >
          <AsideMenuItem
            to="/quiz/create"
            title="Create Quiz"
            hasBullet={true}
            setToggle={setToggle}
          />
          <AsideMenuItem
            to="/quiz"
            title="Quiz"
            hasBullet={true}
            setToggle={setToggle}
          />
          <AsideMenuItem
            to="/quiz/drafts"
            title="Drafts"
            hasBullet={true}
            setToggle={setToggle}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub
          icon="black-right"
          to="/social"
          title="Social"
          toggle={toggle}
          setToggle={setToggle}
        >
          <AsideMenuItemWithSub
            to="/social/reels"
            title="Reels"
            icon="black-right"
            toggle={toggle}
            setToggle={setToggle}
          >
            <AsideMenuItem
              to="/reels/create"
              title="Create Reel"
              hasBullet={true}
              setToggle={setToggle}
            />
            <AsideMenuItem
              to="/reels"
              title="View Reels"
              hasBullet={true}
              setToggle={setToggle}
            />
            <AsideMenuItem
              to="/reels/review"
              title="Review Reels"
              hasBullet={true}
              setToggle={setToggle}
            />
            <AsideMenuItem
              to="/reels/drafts"
              title="Drafts"
              hasBullet={true}
              setToggle={setToggle}
            />
          </AsideMenuItemWithSub>

          <AsideMenuItemWithSub
            to="/social/posts"
            title="Posts"
            icon="black-right"
            toggle={toggle}
            setToggle={setToggle}
          >
            <AsideMenuItem
              to="/post/create"
              title="Create Post"
              hasBullet={true}
              setToggle={setToggle}
            />
            <AsideMenuItem
              to="/posts"
              title="View Posts"
              hasBullet={true}
              setToggle={setToggle}
            />
            <AsideMenuItem
              to="/post/drafts"
              title="Drafts"
              hasBullet={true}
              setToggle={setToggle}
            />
          </AsideMenuItemWithSub>

          <AsideMenuItemWithSub
            to="/social/polls"
            title="Polls"
            icon="black-right"
            toggle={toggle}
            setToggle={setToggle}
          >
            <AsideMenuItem
              to="/poll/create"
              title="Create Poll"
              hasBullet={true}
              setToggle={setToggle}
            />
            <AsideMenuItem
              to="/polls"
              title="View Polls"
              hasBullet={true}
              setToggle={setToggle}
            />
            <AsideMenuItem
              to="/poll/drafts"
              title="Drafts"
              hasBullet={true}
              setToggle={setToggle}
            />
          </AsideMenuItemWithSub>
        </AsideMenuItemWithSub>

        {isAdmin && (
          <AsideMenuItemWithSub
            icon="black-right"
            to="../pages/user-management"
            title="User Management"
            toggle={toggle}
            setToggle={setToggle}
          >
            <AsideMenuItem
              to="/user-management"
              title="Manage Users"
              hasBullet={true}
              setToggle={setToggle}
            />
          </AsideMenuItemWithSub>
        )}

        <AsideMenuItem
          to="/trash"
          title="Trash"
          hasBullet={true}
          setToggle={setToggle}
        />

        {/* Logout menu item - pushed to bottom */}
        <div
          onClick={handleLogoutClick}
          style={{
            width: "100%",
            marginTop: "auto",         // ✅ pushes to bottom
            cursor: "pointer",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderTop: "1px solid #e0e0e0",
          }}
          className="menu-link"
        >
          <KTIcon iconName="logout" className="fs-2 text-danger" />
          <span className="menu-title fw-bold">Logout</span>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={handleLogoutCancel}>
        <DialogTitle>Log Out</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to log out?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel}>Cancel</Button>
          <Button onClick={handleLogoutConfirm} color="primary" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}