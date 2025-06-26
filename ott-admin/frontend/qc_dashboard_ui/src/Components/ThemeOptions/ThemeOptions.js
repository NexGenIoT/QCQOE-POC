/*eslint react-hooks/exhaustive-deps: "off"*/
import React, {  useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import FormControlLabel from '@material-ui/core/FormControlLabel'; 
import Switch from '@material-ui/core/Switch'; 
import { 
   miniSidebarAction,
   darkModeAction,
   boxLayoutAction,
   rtlLayoutAction, 
} from 'Store/Actions'; 

function ThemeOptions(props) { 
   const settings = useSelector(state => state.settings);
   const {
     
      miniSidebar,
      darkMode,
      boxLayout,
      rtlLayout, 
   } = settings;

   const dispatch = useDispatch();

   useEffect(() => {
      if (darkMode) {
         darkModeHanlder(true);
      }
      if (boxLayout) {
         boxLayoutHanlder(true);
      }
      if (rtlLayout) {
         rtlLayoutHanlder(true);
      }
      if (miniSidebar) {
         miniSidebarHanlder(true);
      }
   }, [darkMode, boxLayout, rtlLayout, miniSidebar])

	 
	/**
	 * Mini Sidebar Event Handler
	*/
   const miniSidebarHanlder = (isTrue) => {
      if (isTrue) {
         document.body.classList.add("mini-sidebar");
      }
      else {
         document.body.classList.remove("mini-sidebar");
      }
      setTimeout(() => {
         dispatch(miniSidebarAction(isTrue));
      }, 100)
   }

	/**
	 * Dark Mode Event Hanlder
	 * Use To Enable Dark Mode
	 * @param {*object} event
	*/
   const darkModeHanlder = (isTrue) => {
      if (isTrue) {
         document.body.classList.add("dark-mode");
      }
      else {
         document.body.classList.remove("dark-mode");
      }
      dispatch(darkModeAction(isTrue));
   }

	/**
	 * Box Layout Event Hanlder
	 * Use To Enable Boxed Layout
	 * @param {*object} event
	*/
   const boxLayoutHanlder = (isTrue) => {
      if (isTrue) {
         document.body.classList.add("boxed-layout");
      }
      else {
         document.body.classList.remove("boxed-layout");
      }
      dispatch(boxLayoutAction(isTrue));
   }

	/**
	 * Rtl Layout Event Hanlder
	 * Use to Enable rtl Layout
	 * @param {*object} event
	*/
   const rtlLayoutHanlder = (isTrue) => {
      var root = document.getElementsByTagName('html')[0];
      if (isTrue) {
         root.setAttribute('dir', 'rtl');
         document.body.classList.add("rtl");
      }
      else {
         root.setAttribute('dir', 'ltr');
         document.body.classList.remove("rtl");
      }
      dispatch(rtlLayoutAction(isTrue));
   }

	/**
	 * Change Theme Color Event Handler
	 * @param {*object} theme 
	 */ 


   return (
      <div className="switch-background">
      <FormControlLabel
      control={
      <Switch
      checked={darkMode}
      onChange={(e) => darkModeHanlder(e.target.checked)}
      className="switch-btnss zmdi zmdi-time-interval"
      /> 

      } 
      />         
      </div>
   );
}

export default ThemeOptions;
