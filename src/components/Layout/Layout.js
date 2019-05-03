import React from 'react';
import classes from './Layout.css';
import Toolbar from '../../components/UI/Navigation/Toolbar/Toolbar';

import Aux from '../../hoc/Aux';

const layout = (props) => (
    <Aux>
        <Toolbar/>
        <main className={classes.Content}>
            {props.children}
        </main>
    </Aux>
)

export default layout;