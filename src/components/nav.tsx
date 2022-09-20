import {
  Avatar,
  Navbar,
  Dropdown,
  Switch,
  useTheme,
} from '@nextui-org/react'
import { useTheme as useNextTheme } from 'next-themes'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Nav() {
  const { data: session } = useSession()
  const { setTheme } = useNextTheme()
  const { isDark, type } = useTheme()

  const dropdownAction = (key: string | number) => {
    switch (key) {
      case 'theme':
        setTheme(isDark ? 'light' : 'dark')
        break
      case 'logout':
        signOut()
        break
      case 'login':
        signIn('github')
        break
      default:
        console.log('Dropdown.default.onClick', key)
    }
  }

  return (
    <Navbar
      isBordered={false}
      maxWidth="fluid"
      variant={'floating'}
      className="bg-none child:!bg-gradient-to-tl child:dark:!from-base child:dark:!to-crust/20 child:!from-rosewater child:!to-flamingo/30 child:!mt-4"
    >
      <Navbar.Brand>
        <Avatar squared size="lg" src="/favicon.png" alt="ndo logo" />
      </Navbar.Brand>
      <Navbar.Content>
        <Dropdown placement="bottom-right">
          <Dropdown.Trigger>
            <Avatar
              bordered
              size="lg"
              squared
              zoomed={!!session?.user?.image}
              as="button"
              color="gradient"
              src={session?.user?.image ?? ''}
            />
          </Dropdown.Trigger>
          <Dropdown.Menu
            aria-label="User menu actions"
            disabledKeys={['profile']}
            variant="flat"
            onAction={(key) => dropdownAction(key)}
          >
            <Dropdown.Item key="profile" className="flex" textValue="Profile">
              <span className="font-bold">
                {session?.user?.name ? (
                  `${session?.user.name}`
                ) : 'Not Signed In'}
              </span>
            </Dropdown.Item>
            <Dropdown.Item
              key="theme"
              textValue="Theme"
              withDivider={!!session?.user?.name}
              icon={
                <svg
                  height="24"
                  width="24"
                  fill="none"
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.28547 11.7264C1.64551 10.2935 1.75 8.73187 1.75 8.25H12.25C12.8445 9.14181 13.1077 11.0094 13.2036 12.2518C13.2462 12.8025 12.8023 13.25 12.25 13.25H10.25V11.25C9.05161 13.25 7.25 13.25 7.25 13.25H2.36803C1.62465 13.25 1.10432 12.4474 1.28547 11.7264Z"
                    fill="#ffffff"
                    stroke="#a041d5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.63064 5.5C5.41968 4.56805 5.25 3.55723 5.25 2.75002C5.25 1.15 6.58335 0.75 7.25002 0.75C7.91669 0.75 9.25004 1.15 9.25004 2.75002C9.25004 3.55723 9.08036 4.56805 8.8694 5.5H11.25C12.85 5.5 13.25 6.83333 13.25 7.5C13.25 8.05228 12.8023 8.5 12.25 8.5H2.25C1.69772 8.5 1.25 8.05228 1.25 7.5C1.25 6.83333 1.65 5.5 3.25 5.5H5.63064Z"
                    fill="#fbd7ff"
                    stroke="#a041d5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              <div
                className="flex items-center justify-between"
                onClick={(e) => e.preventDefault()}
              >
                {type?.[0]?.toUpperCase() + type.slice(1, type.length)}
                <Switch checked={isDark} color="secondary" size="sm" />
              </div>
            </Dropdown.Item>
            <Dropdown.Item
              key="settings"
              textValue="Settings"
              icon={
                <svg
                  height="24"
                  width="24"
                  fill="none"
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.959867 10.2685C1.114 11.7092 2.2727 12.8679 3.71266 13.0284C4.78221 13.1476 5.88037 13.25 7 13.25C8.11963 13.25 9.21779 13.1476 10.2873 13.0284C11.7273 12.8679 12.886 11.7092 13.0401 10.2685C13.1539 9.20502 13.25 8.11315 13.25 7C13.25 5.88684 13.1539 4.79498 13.0401 3.73147C12.886 2.29082 11.7273 1.13211 10.2873 0.971609C9.21779 0.852392 8.11963 0.75 7 0.75C5.88037 0.75 4.78221 0.852392 3.71266 0.971609C2.2727 1.13211 1.114 2.29082 0.959867 3.73147C0.846083 4.79498 0.75 5.88684 0.75 7C0.75 8.11315 0.846084 9.20502 0.959867 10.2685Z"
                    fill="#fbd7ff"
                    stroke="#a041d5"
                  />
                  <path
                    d="M4 4.5H7"
                    stroke="#a041d5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 9.5H7"
                    stroke="#a041d5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.5 6C9.32843 6 10 5.32843 10 4.5C10 3.67157 9.32843 3 8.5 3C7.67157 3 7 3.67157 7 4.5C7 5.32843 7.67157 6 8.5 6Z"
                    fill="#ffffff"
                    stroke="#a041d5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 11C4.67157 11 4 10.3284 4 9.5C4 8.67157 4.67157 8 5.5 8C6.32843 8 7 8.67157 7 9.5C7 10.3284 6.32843 11 5.5 11Z"
                    fill="#ffffff"
                    stroke="#a041d5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              Settings
            </Dropdown.Item>
            {session?.user ? (
              <Dropdown.Item
                key="logout"
                withDivider
                color="error"
                textValue="Logout"
                icon={
                  <svg
                    height="24"
                    width="24"
                    fill="none"
                    viewBox="0 0 14 14"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.45102 0.849664C5.77425 0.784187 5.07717 0.75 4.3652 0.75C3.65322 0.75 2.95614 0.784187 2.27937 0.849665C1.53465 0.921717 0.96494 1.67654 0.931302 2.59563C0.879349 4.01513 0.85199 5.48869 0.85199 7C0.85199 8.5113 0.879349 9.98487 0.931302 11.4044C0.96494 12.3235 1.53465 13.0783 2.27937 13.1503C2.95614 13.2158 3.65322 13.25 4.3652 13.25C5.07717 13.25 5.77425 13.2158 6.45102 13.1503C7.19573 13.0783 7.76544 12.3235 7.79908 11.4044C7.81762 10.8979 7.83302 10.3846 7.84517 9.86507V4.13496C7.83302 3.61546 7.81762 3.1021 7.79908 2.59563C7.76544 1.67654 7.19573 0.921715 6.45102 0.849664Z"
                      fill="#fbd7ff"
                    />
                    <path
                      d="M7.79908 2.59563C7.76545 1.67654 7.19573 0.921715 6.45102 0.849664C5.77425 0.784187 5.07717 0.75 4.3652 0.75C3.65322 0.75 2.95614 0.784187 2.27937 0.849665C1.53465 0.921717 0.96494 1.67654 0.931302 2.59563C0.879349 4.01513 0.85199 5.48869 0.85199 7C0.85199 8.5113 0.879349 9.98487 0.931302 11.4044C0.96494 12.3235 1.53465 13.0783 2.27937 13.1503C2.95614 13.2158 3.65322 13.25 4.3652 13.25C5.07717 13.25 5.77425 13.2158 6.45102 13.1503C7.19573 13.0783 7.76545 12.3235 7.79908 11.4044"
                      stroke="#a041d5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.0273 9.96167C11.287 8.92954 11.9165 8.30019 12.8985 7.09041C11.9165 5.88062 11.287 5.25128 10.0273 4.21914"
                      stroke="#a041d5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.00392 7.09058L12.8666 7.09058"
                      stroke="#a041d5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              >
                Log Out
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                key="login"
                withDivider
                color="secondary"
                textValue="Login"
                icon={
                  <svg
                    height="24"
                    width="24"
                    fill="none"
                    viewBox="0 0 14 14"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.58707 0.849664C7.66718 0.784187 6.71969 0.75 5.75196 0.75C4.78421 0.75 3.83672 0.784187 2.91682 0.849665C1.90458 0.921717 1.13021 1.67654 1.08449 2.59563C1.01387 4.01513 0.976685 5.48869 0.976685 7C0.976685 8.5113 1.01387 9.98487 1.08449 11.4044C1.13021 12.3235 1.90459 13.0783 2.91682 13.1503C3.83672 13.2158 4.78421 13.25 5.75196 13.25C6.71969 13.25 7.66718 13.2158 8.58707 13.1503C9.59931 13.0783 10.3737 12.3235 10.4194 11.4044C10.4446 10.8979 10.4655 10.3846 10.4821 9.86507V4.13496C10.4655 3.61546 10.4446 3.1021 10.4194 2.59563C10.3737 1.67654 9.59931 0.921715 8.58707 0.849664Z"
                      fill="#fbd7ff"
                    />
                    <path
                      d="M7 4.12878C5.74024 5.16092 5.11076 5.79027 4.12874 7.00005C5.11076 8.20983 5.74024 8.83918 7 9.87131"
                      stroke="#a041d5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.4821 4.13496C10.4655 3.61546 10.4446 3.1021 10.4194 2.59563C10.3737 1.67654 9.59931 0.921715 8.58707 0.849664C7.66718 0.784187 6.71969 0.75 5.75196 0.75C4.78421 0.75 3.83672 0.784187 2.91682 0.849665C1.90458 0.921717 1.13021 1.67654 1.08449 2.59563C1.01387 4.01513 0.976685 5.48869 0.976685 7C0.976685 8.5113 1.01387 9.98487 1.08449 11.4044C1.13021 12.3235 1.90459 13.0783 2.91682 13.1503C3.83672 13.2158 4.78421 13.25 5.75195 13.25C6.71969 13.25 7.66718 13.2158 8.58707 13.1503C9.59931 13.0783 10.3737 12.3235 10.4194 11.4044C10.4446 10.8979 10.4655 10.3846 10.4821 9.86507"
                      stroke="#a041d5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M13.0234 7L4.16064 7"
                      stroke="#a041d5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              >
                Login
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Content>
    </Navbar>
  )
}
