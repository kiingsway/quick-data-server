import { BR, CA, ES, FR, JP } from "country-flag-icons/react/3x2";
import { TFunction, changeLanguage } from "i18next";

interface ILanguageItems {
  key: string;
  icon: React.JSX.Element;
  label: string;
  onClick: () => Promise<TFunction<"translation", undefined>>;
}

const languages: ILanguageItems[] = [
  {
    key: 'en',
    icon: <CA width={16} />,
    label: "English",
    onClick: () => changeLanguage('en'),
  },
  {
    key: 'br',
    icon: <BR width={16} />,
    label: "Português (Brasileiro)",
    onClick: () => changeLanguage('br'),
  },
  {
    key: 'fr',
    icon: <FR width={16} />,
    label: "Français",
    onClick: () => changeLanguage('fr'),
  },
  {
    key: 'es',
    icon: <ES width={16} />,
    label: "Español",
    onClick: () => changeLanguage('es'),
  },
  {
    key: 'jp',
    icon: <JP width={16} />,
    label: "日本語",
    onClick: () => changeLanguage('jp'),
  },
];

export default languages;