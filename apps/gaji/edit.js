PphControllers.post(
    "/pph-excel",
    [
        UserServiceTokenAuthentication,
        // PphValidators.ID_Pph("param", false),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        const pph = await PphServiceGetSlip("ID_Pph", req.params.ID_Pph, false);
        const items = await PphServiceGetSlip("ID_Pph", req.params.ID_Pph, true);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="pph-${new Date().getTime()}.xlsx"`
        );

        const xlsx = await PphServiceFakturExcel();
        await xlsx.write(res);
        return res.end();
    }
);

PphControllers.post(
    "/reportPph-period-excel",
    [
        UserServiceTokenAuthentication,
        // PphValidators.reportPphing.terms(),
        // PphValidators.reportPphing.startDate(),
        // PphValidators.reportPphing.endDate(),
        BaseValidatorRun(),
    ],
    async (req, res) => {
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="Report Potongan PPH - ${req.body.startDate} sd ${req.body.endDate}.xlsx"`
        );

        const results = await PphServiceReportPeriod(
            req.body.startDate,
            req.body.endDate,
            req.body.terms
        );

        const xlsx = await PphServiceReportPeriodExcel(results);
        await xlsx.write(res);
        return res.end();
    }
);
