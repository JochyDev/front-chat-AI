export interface ErrorMessage {
    response: ErrorResponse;
    status:   number;
    message:  string;
    name:     string;
}

export interface ErrorResponse {
    message:    string;
    error:      string;
    statusCode: number;
}
