package com.sguProject.backendExchange.services.interfaces;

import com.sguProject.backendExchange.models.Account;
import com.sguProject.backendExchange.models.CurrencyPair;
import com.sguProject.backendExchange.util.enums.Operation;

public interface ExchangeService {
    void exchange(String baseTicker, String quotedTicker, double quantity, Operation operation);

    void exchangeLimit(String baseTicker, String quotedTicker, double quantity, Operation operation, double targetCourse);
}
