import React from "reactn"
import {HasClassName} from "../app";

export const Loading = (props: HasClassName) => (<div className={"spinner-border text-warning " + props.className} role="status">
    <span className="sr-only">Loading...</span>
</div>)