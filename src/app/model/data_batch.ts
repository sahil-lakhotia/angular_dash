export interface Data_Batch {
    "batch": any,
	"Start date": any,
	"End Date": any,
	"Number of packs": any,
	"Pre Processing Time": any,
	"Post Init Time": any,
	"Pre Processing Speed": any,
	"Post Init Speed": any,
	"Overall Speed": any,
	"records": [{
				"Process": any,
				"Estimated time": any,
				"Actual time taken": any
    }
    ]
}

export interface Filter_Dates {
"filter_st_dt": Date,
"filter_ed_dt": Date
}