import { useIntl } from "react-intl";
import { AsideMenuItemWithSub } from "./AsideMenuItemWithSub";
import { AsideMenuItem } from "./AsideMenuItem";
import { useState } from "react";
import { Link } from "react-router-dom";

export function AsideMenuMain() {
  const intl = useIntl();
  const [toggle, setToggle] = useState<string>("");

  return (
    <div
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "start",
        fontSize: "16px",  // Increased font size
        fontWeight: "500"   // Added medium weight
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
      

      {/* <AsideMenuItemWithSub icon='black-right' to="../pages/updates/create" title="Updates" toggle={toggle} setToggle={setToggle}>
        <AsideMenuItem
          to="/updates/create"
          title="Create Updates"
          hasBullet={true}
          toggle={toggle} 
          setToggle={setToggle}
        />
        <AsideMenuItem to="/updates" title="Updates" hasBullet={true} toggle={toggle} setToggle={setToggle} />
      </AsideMenuItemWithSub> */}

      {/* <AsideMenuItemWithSub to="/team" icon='black-right' title="Teams"  fontIcon='bi-layers' toggle={toggle} setToggle={setToggle}>
        <AsideMenuItem to='/team/create' title='Create Team' hasBullet={true} toggle={toggle} setToggle={setToggle} />
        <AsideMenuItem to='/team' title='Teams' hasBullet={true} toggle={toggle} setToggle={setToggle} />
      </AsideMenuItemWithSub> */}

      <AsideMenuItemWithSub 
        icon='black-right' 
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
        <AsideMenuItem to="/news" title="Latest News" hasBullet={true} setToggle={setToggle} />
      </AsideMenuItemWithSub>

      {/* <AsideMenuItemWithSub icon='black-right' to="../pages/blogs/create" title="Blogs" toggle={toggle} setToggle={setToggle}>
        <AsideMenuItem
          to="/blogs/create"
          title="Create Blogs"
          hasBullet={true}
          toggle={toggle} 
          setToggle={setToggle}
        />
        <AsideMenuItem to="/blogs" title="Blogs" hasBullet={true} toggle={toggle} setToggle={setToggle} />
      </AsideMenuItemWithSub> */}
      {/* <AsideMenuItemWithSub icon='black-right' to="../pages/tutorials/create" title="Football Tutorials" toggle={toggle} setToggle={setToggle}>
        <AsideMenuItem
          to="/tutorials/create"
          title="Create Tutorials"
          hasBullet={true}
          toggle={toggle} 
          setToggle={setToggle}
        />
        <AsideMenuItem to="/tutorials" title="Football Tutorials" hasBullet={true} toggle={toggle} setToggle={setToggle} />
      </AsideMenuItemWithSub> */}

      <AsideMenuItemWithSub 
        icon='black-right' 
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
        </AsideMenuItemWithSub>

      </AsideMenuItemWithSub>


        <AsideMenuItemWithSub
          icon='black-right'
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
    </div>
  );
}
