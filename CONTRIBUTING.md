# Contributing

Thank you for your interest in contributing to the AirSwap Marketplace! We welcome contributions no matter their size.

## Issues

While we use GitHub for issue tracking and project management, development is generally coordinated on the [Discord server](https://chat.airswap.io/), which you should join to learn more about how and where to contribute.

## Key libraries

- [Craco](https://www.npmjs.com/package/@craco/craco) (Create React App Configuration Override)
- [AirSwap protocols](https://github.com/airswap/airswap-protocols)
- [ethers](https://docs.ethers.io/)
- [Redux](https://redux-toolkit.js.org/)

## Code Style

When multiple people are working on the same body of code, it is important that everyone conforms to a style. We use eslint for formatting our code.

## BEM

We use BEM for styling. When styling a component put your scss in a separate .scss file. Please follow the rules lined out by [sparkbox](https://sparkbox.com/foundry/bem_by_example). When your component gets too crowded try to split your code in subcomponents.

#### Rem

We define dimensions using `rem` based on 16px, so use units like `0.125rem`, `0.25rem`, etc.

#### Order of properties

The order of css properties should be based on matter of importance it has on the box-model. For instance these properties are sorted by their importance: `display`, `position`, `margin`, `border`, `width`, `padding`, `line-height`, `font-size`, `z-index`, `background`. This could be a little arbitrary so we're not very too about this.

On top you have @extend and @include. Then the component styles. After that the modifiers and then the children styles.

### Scss file example

```scss
@import "src/styles/index";

.some-component {
    @extend %flex-align-center;   

    border: 1px solid var(--c-light-grey);
    width: 100%;
    height: 3rem;
    padding: 0.5rem;
    background: var(--c-grey);
    z-index: 1;
    
    &--is-primary {
        background: var(--c-red);
    }

    &__a-button,
    &__b-button {
        height: 2rem;
        aspect-ratio: 1;
        color: var(--c-white);
    }

    &__a-button {
        position: absolute;
        left: calc(50% - 1rem);
    }
```

#### Naming of modifiers

When naming of modifiers the same rules apply for react properties lined out in [this article of David Linau](https://dlinau.wordpress.com/2016/02/22/how-to-name-props-for-react-components/). For example: `--is-primary` and `--has-header`.

#### Positioning elements

When positioning an element using `absolute`, `fixed` or similar, the parent should set the style of the child.

#### Please Do not

Directly style tags (`div`, `span`, etc). Unless your branch is WIP and you add a `TODO` above to it.

## React components

When making a new component please take a look at the current components to get an idea what style we are using. Here's an example of the interface of a simple component:

```typescript
interface CheckboxProps {
  hideLabel?: boolean;
  isChecked: boolean;
  label: string;
  subLabel?: string;
  onChange: (isChecked: boolean) => void;
  className?: string;
}
```

#### Naming conventions and order of properties

For naming conventions please refer to [this article of David Linau](https://dlinau.wordpress.com/2016/02/22/how-to-name-props-for-react-components/).
The order of properties are as following: first we have modifiers (ie: `isActive`, `hideLabel`), then other data properties (ie: `items`, `label`), then event handlers (ie: `onClick`, `onChange`) and finally the `className?` which every components needs to have so it can be styled by it's parent.

### Component structure

As you can see below the order of data and handlers are: hooks, states, useEffect, event handlers.

```typescript
const TopBar: FC<TopBarProps> = ({ hideLabel, className = '' }) => {
  const { t } = useTranslation();

  const [isConnecting, setIsConnecting] = useState(false);
  const [mobileMenuIsVisible, setMobileMenuIsVisible] = useState(false);

  useEffect(() => {
    // Some effect here
  }, [mobileMenuIsVisible]);
  
  const handleMobileToggleButtonClick = () => {
    setMobileMenuIsVisible(!mobileMenuIsVisible);
  }

  return (
    <div className={`top-bar ${className}`}>
```

### Classnames

If you have dynamic modifiers for your BEM classes use `classNames` preferable at the top of your component.

```typescript
const checkboxClassNames = classNames('checkbox', {
    'checkbox--is-checked': checked,
}, className);
```

### Component types

We divide our components very similar to [Atomic design from Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/). We use 4 types of components:

- Component
- Composition
- Widget
- Page

The `component` is the smallest. Then when a component has one or more components it's a `composition`. A `widget` is where all components are gathered and connected to the store and actions dispatched. A `widget` is standalone; it should always work without a parent giving it props.

A `page` is connected to the routing of the app and should direct the user to one or more widgets.

## Redux

We use [redux toolkit](https://redux-toolkit.js.org) for store management. Use [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk) for all asynchronous actions. Errors should be transformed to `AppError`, processed in the action and saved in the store. An example:

```typescript
const UsersComponent = () => {
  const { user, isLoading, error } = useSelector((state) => state.users)
  const dispatch = useDispatch()

  const fetchUser = (userId) => {
    dispatch(fetchUserById(userId));
  }

  // render UI here
}
```

// TODO: some more explanation about error handling

## Translations (POEditor)

New translations should be added manually to `public/locales/en/translation.json` first. After your PR is merged an admin will add the new translations in [POEditor](https://poeditor.com/). Everything in `public/locales` will eventually be overwritten by POEditor. If you want to help with translating please let us know.

## Pull Requests (PRs)

It’s a good idea to make PRs early on. A PR represents the start of a discussion, and doesn’t necessarily need to be the final, completed submission. Create a [draft PR](https://github.blog/2019-02-14-introducing-draft-pull-requests/) if you're looking for feedback but not ready for a final review. If the PR is in response to a GitHub issue, make sure to notate the issue as well.

#### PR Description

Usually your PR is connected to a ticket number, so please put the ticket number (for example 101) in the description of your PR like so:

`Fixes #101`

GitHub’s documentation for working on PRs is available [here](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests).

Once your PR is ready, ensure all checks are passing and request a review.
