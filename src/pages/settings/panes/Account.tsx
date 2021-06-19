import { Text } from "preact-i18n";
import styles from "./Panes.module.scss";
import Tip from "../../../components/ui/Tip";
import Button from "../../../components/ui/Button";
import { Users } from "revolt.js/dist/api/objects";
import { Link, useHistory } from "react-router-dom";
import Overline from "../../../components/ui/Overline";
import { AtSign, Key, Mail } from "@styled-icons/feather";
import { useForceUpdate, useSelf } from "../../../context/revoltjs/hooks";
import UserIcon from "../../../components/common/UserIcon";
import { useContext, useEffect, useState } from "preact/hooks";
import { ClientStatus, StatusContext } from "../../../context/revoltjs/RevoltClient";
import { useIntermediate } from "../../../context/intermediate/Intermediate";

export function Account() {
    const { openScreen } = useIntermediate();
    const status = useContext(StatusContext);

    const ctx = useForceUpdate();
    const user = useSelf(ctx);
    if (!user) return null;

    const [email, setEmail] = useState("...");
    const [profile, setProfile] = useState<undefined | Users.Profile>(
        undefined
    );
    const history = useHistory();

    function switchPage(to: string) {
        history.replace(`/settings/${to}`);
    }

    useEffect(() => {
        if (email === "..." && status === ClientStatus.ONLINE) {
            ctx.client
                .req("GET", "/auth/user")
                .then(account => setEmail(account.email));
        }

        if (profile === undefined && status === ClientStatus.ONLINE) {
            ctx.client.users
                .fetchProfile(user._id)
                .then(profile => setProfile(profile ?? {}));
        }
    }, [status]);

    return (
        <div className={styles.user}>
            <div className={styles.banner}>
                <Link to="/settings/profile">
                    <UserIcon target={user} size={72} />
                </Link>
                <div className={styles.username}>@{user.username}</div>
            </div>
            <div className={styles.details}>
                {[
                    ["username", user.username, <AtSign size={24} />],
                    ["email", email, <Mail size={24} />],
                    ["password", "*****", <Key size={24} />]
                ].map(([field, value, icon]) => (
                    <div>
                        {icon}
                        <div className={styles.detail}>
                            <Overline>
                                <Text id={`login.${field}`} />
                            </Overline>
                            <p>{value}</p>
                        </div>
                        <div>
                            <Button
                                onClick={() =>
                                    openScreen({
                                        id: "modify_account",
                                        field: field as any
                                    })
                                }
                                contrast
                            >
                                <Text id="app.settings.pages.account.change_field" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <Tip>
                <span>
                    <Text id="app.settings.tips.account.a" />
                </span>{" "}
                <a onClick={() => switchPage("profile")}>
                    <Text id="app.settings.tips.account.b" />
                </a>
            </Tip>
        </div>
    );
}
