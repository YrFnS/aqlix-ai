/**
 * Iraqi AI Chat Desktop - RTL-Aware Sidebar Component
 * Professional domain support with cultural adaptations
 */

import React, { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

// Icons
import {
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  UserIcon,
  BellIcon,
  ChartBarIcon,
  ScaleIcon,
  HeartIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

// Types
import type {
  ProfessionalDomain,
  CulturalMode,
  ChatSession,
  AppState,
} from "../../types/app.types";

// Components
import { ProfessionalModeToggle } from "../Professional/ProfessionalModeToggle";
import { RecentChats } from "../Chat/RecentChats";
import { SearchInput } from "../UI/SearchInput";

// Styled Components
const SidebarContainer = styled(motion.aside)<{
  $collapsed: boolean;
  $isRTL: boolean;
  $culturalMode: CulturalMode;
}>`
  position: relative;
  height: 100vh;
  width: ${({ $collapsed }) => ($collapsed ? "64px" : "280px")};
  min-width: ${({ $collapsed }) => ($collapsed ? "64px" : "280px")};
  background: ${({ $culturalMode }) =>
    $culturalMode === "government"
      ? "linear-gradient(180deg, #f8f9fb 0%, #ffffff 100%)"
      : "var(--bg-secondary)"};
  border-${({ $isRTL }) => ($isRTL ? "left" : "right")}: 1px solid var(--text-secondary);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 100;
  
  ${({ $culturalMode }) =>
    $culturalMode === "government" &&
    `
    border-top: 3px solid var(--iraqi-red);
    box-shadow: var(--shadow-lg);
  `}
  
  transition: width 0.3s var(--ease-mesopotamian);
`;

const SidebarHeader = styled.div<{ $isRTL: boolean }>`
  padding: var(--spacing-lg);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;

  .logo-section {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    flex: 1;

    .logo {
      width: 32px;
      height: 32px;
      background: linear-gradient(
        135deg,
        var(--tigris-blue),
        var(--mesopotamian-gold)
      );
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 16px;
    }

    .title {
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .subtitle {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-top: 2px;
    }
  }

  .toggle-button {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--spacing-md) 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--text-secondary);
    border-radius: 2px;
    opacity: 0.3;
  }

  &::-webkit-scrollbar-thumb:hover {
    opacity: 0.5;
  }
`;

const MenuSection = styled.div<{ $collapsed: boolean }>`
  padding: 0 var(--spacing-md);
  margin-bottom: var(--spacing-lg);

  .section-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--spacing-sm);
    padding: 0 var(--spacing-sm);
    opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
    visibility: ${({ $collapsed }) => ($collapsed ? "hidden" : "visible")};
    transition: all 0.2s ease;
  }
`;

const MenuItem = styled(motion.button)<{
  $active?: boolean;
  $collapsed: boolean;
  $isRTL: boolean;
  $domain?: ProfessionalDomain;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: ${({ $active }) =>
    $active ? "var(--accent-primary)" : "transparent"};
  color: ${({ $active }) => ($active ? "white" : "var(--text-primary)")};
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: ${({ $isRTL }) => ($isRTL ? "right" : "left")};
  transition: all 0.2s ease;
  margin-bottom: var(--spacing-xs);

  ${({ $domain }) =>
    $domain &&
    `
    border-left: 3px solid var(--domain-${$domain}-color, var(--accent-primary));
    background: ${$domain ? `var(--domain-${$domain}-bg, var(--bg-tertiary))` : "transparent"};
  `}

  &:hover {
    background: ${({ $active, $domain }) => {
      if ($active) return "var(--accent-primary)";
      if ($domain) return `var(--domain-${$domain}-bg, var(--bg-tertiary))`;
      return "var(--bg-tertiary)";
    }};
    transform: translateX(${({ $isRTL }) => ($isRTL ? "-2px" : "2px")});
  }

  &:active {
    transform: scale(0.98);
  }

  .icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    opacity: ${({ $active }) => ($active ? 1 : 0.7)};
  }

  .label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
    visibility: ${({ $collapsed }) => ($collapsed ? "hidden" : "visible")};
    transition: all 0.2s ease;
  }

  .badge {
    background: ${({ $active }) =>
      $active ? "rgba(255, 255, 255, 0.2)" : "var(--accent-primary)"};
    color: ${({ $active }) => ($active ? "white" : "white")};
    font-size: 0.625rem;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
    opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
    visibility: ${({ $collapsed }) => ($collapsed ? "hidden" : "visible")};
    transition: all 0.2s ease;
  }
`;

const NewChatButton = styled(MenuItem)`
  background: linear-gradient(135deg, var(--tigris-blue), #2563eb);
  color: white;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);

  &:hover {
    background: linear-gradient(135deg, #1e40af, #1d4ed8);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .icon {
    opacity: 1;
  }
`;

const ProfessionalIndicator = styled.div<{
  $domain: ProfessionalDomain;
  $collapsed: boolean;
}>`
  padding: var(--spacing-sm) var(--spacing-md);
  margin: 0 var(--spacing-md) var(--spacing-md);
  background: ${({ $domain }) =>
    `var(--domain-${$domain}-bg, var(--bg-tertiary))`};
  border: 1px solid
    ${({ $domain }) => `var(--domain-${$domain}-color, var(--accent-primary))`};
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  visibility: ${({ $collapsed }) => ($collapsed ? "hidden" : "visible")};
  transition: all 0.2s ease;

  .indicator-dot {
    width: 8px;
    height: 8px;
    background: ${({ $domain }) =>
      `var(--domain-${$domain}-color, var(--accent-primary))`};
    border-radius: 50%;
    flex-shrink: 0;
  }

  .indicator-text {
    font-size: 0.75rem;
    font-weight: 500;
    color: ${({ $domain }) =>
      `var(--domain-${$domain}-color, var(--text-primary))`};
  }
`;

// Professional Domain Icons
const getDomainIcon = (domain: ProfessionalDomain): JSX.Element => {
  const iconMap: Record<ProfessionalDomain, JSX.Element> = {
    general: <ChatBubbleLeftIcon className="icon" />,
    legal: <ScaleIcon className="icon" />,
    medical: <HeartIcon className="icon" />,
    educational: <AcademicCapIcon className="icon" />,
    engineering: <WrenchScrewdriverIcon className="icon" />,
    business: <BriefcaseIcon className="icon" />,
    government: <BuildingOffice2Icon className="icon" />,
  };
  return iconMap[domain] || iconMap.general;
};

// Animation Variants
const sidebarVariants = {
  expanded: {
    width: 280,
    transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
  },
  collapsed: {
    width: 64,
    transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
  },
};

const menuItemVariants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  culturalMode: CulturalMode;
  professionalDomain: ProfessionalDomain;
  isRTL: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  culturalMode,
  professionalDomain,
  isRTL,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Selectors
  const { currentView, recentChats, unreadCount } = useSelector(
    (state: AppState) => ({
      currentView: state.app.currentView,
      recentChats: state.chat.recentChats,
      unreadCount: state.notifications.unreadCount,
    }),
  );

  // State
  const [searchQuery, setSearchQuery] = useState("");

  // Handlers
  const handleViewChange = useCallback(
    (view: string) => {
      dispatch({ type: "SET_CURRENT_VIEW", payload: view });
    },
    [dispatch],
  );

  const handleNewChat = useCallback(() => {
    dispatch({ type: "CREATE_NEW_CHAT" });
  }, [dispatch]);

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      dispatch({ type: "SET_CHAT_SEARCH_QUERY", payload: query });
    },
    [dispatch],
  );

  // Memoized menu items
  const menuItems = useMemo(
    () => [
      {
        id: "chat",
        label: t("sidebar.chat", { defaultValue: "المحادثة" }),
        icon: <ChatBubbleLeftIcon className="icon" />,
        active: currentView === "chat",
        onClick: () => handleViewChange("chat"),
      },
      {
        id: "documents",
        label: t("sidebar.documents", { defaultValue: "الوثائق" }),
        icon: <DocumentTextIcon className="icon" />,
        active: currentView === "documents",
        onClick: () => handleViewChange("documents"),
      },
      {
        id: "analytics",
        label: t("sidebar.analytics", { defaultValue: "التحليلات" }),
        icon: <ChartBarIcon className="icon" />,
        active: currentView === "analytics",
        onClick: () => handleViewChange("analytics"),
      },
      {
        id: "profile",
        label: t("sidebar.profile", { defaultValue: "الملف الشخصي" }),
        icon: <UserIcon className="icon" />,
        active: currentView === "profile",
        onClick: () => handleViewChange("profile"),
      },
      {
        id: "notifications",
        label: t("sidebar.notifications", { defaultValue: "الإشعارات" }),
        icon: <BellIcon className="icon" />,
        active: currentView === "notifications",
        badge: unreadCount > 0 ? unreadCount.toString() : undefined,
        onClick: () => handleViewChange("notifications"),
      },
      {
        id: "settings",
        label: t("sidebar.settings", { defaultValue: "الإعدادات" }),
        icon: <Cog6ToothIcon className="icon" />,
        active: currentView === "settings",
        onClick: () => handleViewChange("settings"),
      },
    ],
    [currentView, unreadCount, t, handleViewChange],
  );

  return (
    <SidebarContainer
      $collapsed={collapsed}
      $isRTL={isRTL}
      $culturalMode={culturalMode}
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
    >
      {/* Header */}
      <SidebarHeader $isRTL={isRTL}>
        <div className="logo-section">
          <div className="logo">{isRTL ? "ع.ذ" : "AI"}</div>
          {!collapsed && (
            <div>
              <div className="title">
                {t("app.title", { defaultValue: "الذكاء الاصطناعي العراقي" })}
              </div>
              <div className="subtitle">
                {t("app.subtitle", { defaultValue: "نظام الدردشة المتقدم" })}
              </div>
            </div>
          )}
        </div>
        <button className="toggle-button" onClick={onToggle}>
          {collapsed ? <Bars3Icon /> : <XMarkIcon />}
        </button>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* New Chat Button */}
        <MenuSection $collapsed={collapsed}>
          <NewChatButton
            $collapsed={collapsed}
            $isRTL={isRTL}
            onClick={handleNewChat}
            variants={menuItemVariants}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusIcon className="icon" />
            <span className="label">
              {t("sidebar.newChat", { defaultValue: "محادثة جديدة" })}
            </span>
          </NewChatButton>
        </MenuSection>

        {/* Professional Domain Indicator */}
        {professionalDomain !== "general" && (
          <ProfessionalIndicator
            $domain={professionalDomain}
            $collapsed={collapsed}
          >
            <div className="indicator-dot" />
            <div className="indicator-text">
              {t(`professional.domain.${professionalDomain}.name`, {
                defaultValue: professionalDomain,
              })}
            </div>
          </ProfessionalIndicator>
        )}

        {/* Search */}
        {!collapsed && (
          <MenuSection $collapsed={collapsed}>
            <SearchInput
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t("sidebar.searchChats", {
                defaultValue: "البحث في المحادثات...",
              })}
              isRTL={isRTL}
            />
          </MenuSection>
        )}

        {/* Main Menu */}
        <MenuSection $collapsed={collapsed}>
          <div className="section-title">
            {t("sidebar.sections.main", { defaultValue: "القائمة الرئيسية" })}
          </div>
          <AnimatePresence>
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                $active={item.active}
                $collapsed={collapsed}
                $isRTL={isRTL}
                onClick={item.onClick}
                variants={menuItemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {item.icon}
                <span className="label">{item.label}</span>
                {item.badge && <span className="badge">{item.badge}</span>}
              </MenuItem>
            ))}
          </AnimatePresence>
        </MenuSection>

        {/* Professional Domains */}
        {!collapsed && (
          <MenuSection $collapsed={collapsed}>
            <div className="section-title">
              {t("sidebar.sections.domains", {
                defaultValue: "المجالات المهنية",
              })}
            </div>
            <ProfessionalModeToggle
              currentDomain={professionalDomain}
              culturalMode={culturalMode}
              isRTL={isRTL}
            />
          </MenuSection>
        )}

        {/* Recent Chats */}
        {!collapsed && (
          <MenuSection $collapsed={collapsed}>
            <div className="section-title">
              {t("sidebar.sections.recent", {
                defaultValue: "المحادثات الأخيرة",
              })}
            </div>
            <RecentChats
              chats={recentChats}
              searchQuery={searchQuery}
              culturalMode={culturalMode}
              isRTL={isRTL}
            />
          </MenuSection>
        )}
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;
