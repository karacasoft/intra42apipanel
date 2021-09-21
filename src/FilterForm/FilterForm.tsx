import { Collapse, Grid, makeStyles, TextField, Theme, Typography, WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { BaseFilter } from "../connector/endpoint";


export interface FilterFormProps { 
    
}

export interface FilterFormState {
    open: boolean;
}

abstract class FilterForm<T extends BaseFilter> extends React.Component<FilterFormProps, FilterFormState> {

    filterFields: (keyof T)[] = [];

    constructor(props: FilterFormProps) {
        super(props);
        this.state = {
            open: false,
        };
        this.changeFilterField.bind(this);
    }

    abstract get filter(): Partial<T>;

    changeFilterField(field: keyof T, value: any) {
        runInAction(() => {
            this.filter[field] = value;
        });
    }

    render() {
        return <Grid container>
            <Grid item xs={12}
                    onClick={() => this.setState({ open: !this.state.open })}
                    style={{
                        cursor: "pointer",
                    }}
                    >
                <Typography>Filters</Typography>
            </Grid>
            <Collapse in={this.state.open}>
                <div>
                {this.filterFields.map(field => (
                    <Grid key={field as string} item>
                        <TextField 
                                label={field}
                                value={this.filter[field]}
                                onChange={(ev) => {
                                    this.changeFilterField(field, ev.target.value);
                                    console.log("field", field);
                                }}
                                />
                    </Grid>
                ))}
                </div>
            </Collapse>
        </Grid>;
    }
}

export default FilterForm;