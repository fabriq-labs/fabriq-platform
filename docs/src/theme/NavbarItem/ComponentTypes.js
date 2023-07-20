import GetStartButton from '@site/src/components/NavbarItems/getstart';
import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';

// this is needed currently (07/2022) to add a custom component to the navbar
// (see https://github.com/facebook/docusaurus/issues/7227).
export default {
  ...ComponentTypes,
  'custom-getStartButton': GetStartButton,
};